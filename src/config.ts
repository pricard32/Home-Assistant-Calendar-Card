import type { CalendarView, FamilyHubCalendarConfig, HomeAssistant } from "./types";

const DEFAULT_VIEWS: CalendarView[] = [
  "day",
  "3day",
  "week",
  "work_week",
  "month",
  "agenda",
  "timeline"
];

export const DEFAULT_CONFIG: Omit<FamilyHubCalendarConfig, "type" | "calendars"> = {
  title: "Family Hub Calendar",
  default_view: "week",
  enabled_views: DEFAULT_VIEWS,
  grouped_by_calendar: false,
  weather_placement: "header",
  week_start_day: 1,
  time_format: "12h",
  font_size: "medium",
  show_header: true,
  show_sidebar: true,
  show_weather: true,
  show_tasks: true,
  show_meals: true,
  event_density: "comfortable",
  compact_mode: false,
  border_radius: 16,
  theme_colors: {
    background: "var(--ha-card-background, #111827)",
    surface: "var(--card-background-color, #1f2937)",
    text: "var(--primary-text-color, #f9fafb)",
    accent: "var(--primary-color, #60a5fa)"
  },
  family_member_colors: {}
};

export const normalizeConfig = (config: FamilyHubCalendarConfig): FamilyHubCalendarConfig => {
  if (!config.calendars || config.calendars.length === 0) {
    throw new Error("You need to define at least one calendar in calendars");
  }

  return {
    ...DEFAULT_CONFIG,
    ...config,
    enabled_views: config.enabled_views?.length ? config.enabled_views : DEFAULT_VIEWS,
    calendars: config.calendars.map((calendar) => ({
      ...calendar,
      enabled: calendar.enabled !== false
    }))
  };
};

export const detectDefaultCalendars = (hass: HomeAssistant): string[] =>
  Object.keys(hass.states).filter((entityId) => entityId.startsWith("calendar."));

export const dateRangeForView = (
  selectedDate: Date,
  view: CalendarView,
  weekStartDay: 0 | 1
): { start: Date; end: Date } => {
  const start = new Date(selectedDate);
  const end = new Date(selectedDate);

  if (view === "day" || view === "agenda" || view === "timeline") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (view === "3day") {
    start.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 2);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (view === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(end.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  const day = selectedDate.getDay();
  const diffToStart = (day - weekStartDay + 7) % 7;
  start.setDate(selectedDate.getDate() - diffToStart);
  start.setHours(0, 0, 0, 0);

  const length = view === "work_week" ? 4 : 6;
  end.setTime(start.getTime());
  end.setDate(start.getDate() + length);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};
