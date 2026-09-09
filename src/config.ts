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
  show_empty_days: true,
  theme_preset: "auto",
  layout_orientation: "vertical",
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

export interface ThemePreset {
  id: string;
  label: string;
  colors: NonNullable<FamilyHubCalendarConfig["theme_colors"]>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "auto",
    label: "Home Assistant (auto)",
    colors: {
      background: "var(--ha-card-background, var(--card-background-color))",
      surface: "var(--card-background-color, #1f2937)",
      text: "var(--primary-text-color)",
      accent: "var(--primary-color)"
    }
  },
  {
    id: "midnight",
    label: "Midnight",
    colors: { background: "#0f172a", surface: "#1e293b", text: "#f8fafc", accent: "#60a5fa" }
  },
  {
    id: "light",
    label: "Light",
    colors: { background: "#ffffff", surface: "#f3f4f6", text: "#111827", accent: "#2563eb" }
  },
  {
    id: "sunset",
    label: "Sunset",
    colors: { background: "#1a1025", surface: "#2d1b3d", text: "#fde8ff", accent: "#fb7185" }
  },
  {
    id: "forest",
    label: "Forest",
    colors: { background: "#0f1f17", surface: "#173328", text: "#e6f4ea", accent: "#34d399" }
  },
  {
    id: "ocean",
    label: "Ocean",
    colors: { background: "#071a2b", surface: "#0f2a44", text: "#e0f2fe", accent: "#38bdf8" }
  }
];

/**
 * Full calendar-grid days for the month containing `selectedDate`, aligned to
 * `weekStartDay` so every row is a complete week. When `includeAdjacentMonths`
 * is false, only days that belong to the current month are returned (the grid
 * may then start/end mid-week).
 */
export const monthGridDays = (
  selectedDate: Date,
  weekStartDay: 0 | 1,
  includeAdjacentMonths = true
): Date[] => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const diffToStart = (firstOfMonth.getDay() - weekStartDay + 7) % 7;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - diffToStart);

  const weekEndDay = (weekStartDay + 6) % 7;
  const diffToEnd = (weekEndDay - lastOfMonth.getDay() + 7) % 7;
  const gridEnd = new Date(lastOfMonth);
  gridEnd.setDate(lastOfMonth.getDate() + diffToEnd);

  const days: Date[] = [];
  const cursor = new Date(gridStart);
  cursor.setHours(0, 0, 0, 0);
  const last = new Date(gridEnd);
  last.setHours(0, 0, 0, 0);
  while (cursor <= last) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return includeAdjacentMonths ? days : days.filter((day) => day.getMonth() === month);
};

/** Every individual day covered by a view's date range (day/3day/week/work_week/month). */
export const gridDaysForView = (selectedDate: Date, view: CalendarView, weekStartDay: 0 | 1): Date[] => {
  const { start, end } = dateRangeForView(selectedDate, view, weekStartDay);
  const days: Date[] = [];
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (cursor <= last) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
};

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
