import type { CalendarSourceConfig, HomeAssistant, HomeAssistantState } from "./types";

export interface HubEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location?: string;
  organizer?: string;
  attendees?: string[];
  links?: string[];
  calendarEntity: string;
  calendarName: string;
  calendarColor: string;
  sourceType: "calendar" | "task" | "meal";
  priority?: string;
  assignedTo?: string;
  category?: string;
  completed?: boolean;
}

const DEFAULT_COLORS = ["#4F86F7", "#4CAF50", "#FF9800", "#7E57C2", "#F06292", "#26A69A"];

const parseDate = (value: unknown): Date | undefined => {
  if (typeof value !== "string") return undefined;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const stateEvents = (state: HomeAssistantState): Record<string, unknown>[] => {
  const events = state.attributes.events;
  if (Array.isArray(events)) return events as Record<string, unknown>[];

  const start = parseDate(state.attributes.start_time);
  const end = parseDate(state.attributes.end_time);
  const message = typeof state.attributes.message === "string" ? state.attributes.message : undefined;

  if (start && end && message) {
    return [
      {
        id: `${state.entity_id}:${start.toISOString()}`,
        title: message,
        start,
        end,
        description: state.attributes.description,
        location: state.attributes.location,
        organizer: state.attributes.organizer,
        attendees: state.attributes.attendees,
        all_day: state.attributes.all_day,
        links: state.attributes.links
      }
    ];
  }

  return [];
};

export const extractCalendarEvents = (
  hass: HomeAssistant,
  calendars: CalendarSourceConfig[]
): HubEvent[] => {
  const events: HubEvent[] = [];
  calendars
    .filter((calendar) => calendar.enabled !== false)
    .forEach((calendar, index) => {
      const state = hass.states[calendar.entity];
      if (!state) return;

      const calendarName = calendar.name || (state.attributes.friendly_name as string) || calendar.entity;
      const calendarColor = calendar.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

      for (const event of stateEvents(state)) {
        const start = event.start instanceof Date ? event.start : parseDate(event.start);
        const end = event.end instanceof Date ? event.end : parseDate(event.end);
        if (!start || !end) continue;

        events.push({
          id: String(event.id ?? `${calendar.entity}:${start.toISOString()}`),
          title: String(event.title ?? "Untitled event"),
          description: typeof event.description === "string" ? event.description : undefined,
          start,
          end,
          allDay: Boolean(event.all_day),
          location: typeof event.location === "string" ? event.location : undefined,
          organizer: typeof event.organizer === "string" ? event.organizer : undefined,
          attendees: Array.isArray(event.attendees)
            ? event.attendees.map((attendee) => String(attendee))
            : undefined,
          links: Array.isArray(event.links) ? event.links.map((link) => String(link)) : undefined,
          calendarEntity: calendar.entity,
          calendarName,
          calendarColor,
          sourceType: "calendar"
        });
      }
    });

  return events;
};

export const extractTasks = (
  hass: HomeAssistant,
  taskEntities: string[] = [],
  itemsByEntity: Record<string, Record<string, unknown>[]> = {}
): HubEvent[] => {
  const tasks: HubEvent[] = [];
  taskEntities.forEach((entity) => {
    const state = hass.states[entity];
    if (!state) return;

    const items = itemsByEntity[entity] ?? [];
    items.forEach((item, index) => {
      const due = parseDate(item.due ?? item.due_date);
      if (!due) return;

      tasks.push({
        id: `${entity}:task:${index}`,
        title: String(item.summary ?? item.title ?? "Task"),
        description: typeof item.description === "string" ? item.description : undefined,
        start: due,
        end: due,
        calendarEntity: entity,
        calendarName: String(state.attributes.friendly_name ?? entity),
        calendarColor: "#FFB300",
        sourceType: "task",
        priority: typeof item.priority === "string" ? item.priority : undefined,
        assignedTo: typeof item.assignee === "string" ? item.assignee : undefined,
        category: typeof item.category === "string" ? item.category : undefined,
        completed: String(item.status ?? "") === "completed"
      });
    });
  });

  return tasks;
};

export const extractMeals = (hass: HomeAssistant, mealEntities: string[] = []): HubEvent[] => {
  const meals: HubEvent[] = [];
  mealEntities.forEach((entity) => {
    const state = hass.states[entity];
    if (!state) return;

    const entries = Array.isArray(state.attributes.meals)
      ? (state.attributes.meals as Record<string, unknown>[])
      : [];

    entries.forEach((entry, index) => {
      const date = parseDate(entry.date);
      if (!date) return;
      const mealType = String(entry.type ?? "Meal");
      meals.push({
        id: `${entity}:meal:${index}`,
        title: `${mealType}: ${String(entry.name ?? "Unassigned")}`,
        description: typeof entry.notes === "string" ? entry.notes : undefined,
        start: date,
        end: date,
        allDay: true,
        calendarEntity: entity,
        calendarName: String(state.attributes.friendly_name ?? "Meals"),
        calendarColor: typeof entry.color === "string" ? entry.color : "#F06292",
        sourceType: "meal",
        category: mealType
      });
    });
  });

  return meals;
};

export const sortEvents = (events: HubEvent[]): HubEvent[] =>
  [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

export const eventsOnDay = (events: HubEvent[], day: Date): HubEvent[] => {
  const dayStart = new Date(day);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(day);
  dayEnd.setHours(23, 59, 59, 999);
  return events.filter((event) => event.end >= dayStart && event.start <= dayEnd);
};

export const eventDuration = (event: HubEvent): string => {
  const minutes = Math.max(0, Math.round((event.end.getTime() - event.start.getTime()) / 60000));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${remainingMinutes}m`;
};
