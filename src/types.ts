export type CalendarView =
  | "day"
  | "3day"
  | "week"
  | "work_week"
  | "month"
  | "agenda"
  | "timeline";

export type WeatherPlacement = "header" | "sidebar" | "day_cell" | "agenda";

export interface CalendarSourceConfig {
  entity: string;
  name?: string;
  color?: string;
  enabled?: boolean;
}

export interface FamilyMemberConfig {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
}

export interface FamilyHubCalendarConfig {
  type: "custom:family-hub-calendar";
  title?: string;
  calendars: CalendarSourceConfig[];
  default_view?: CalendarView;
  enabled_views?: CalendarView[];
  grouped_by_calendar?: boolean;
  weather_entity?: string;
  weather_placement?: WeatherPlacement;
  language?: "en" | "fr";
  week_start_day?: 0 | 1;
  time_format?: "12h" | "24h";
  font_size?: "small" | "medium" | "large";
  font_family?: string;
  show_header?: boolean;
  show_sidebar?: boolean;
  show_weather?: boolean;
  show_tasks?: boolean;
  show_meals?: boolean;
  event_density?: "comfortable" | "compact";
  compact_mode?: boolean;
  border_radius?: number;
  show_empty_days?: boolean;
  theme_preset?: string;
  theme_colors?: {
    background?: string;
    surface?: string;
    text?: string;
    accent?: string;
  };
  family_member_colors?: Record<string, string>;
  family_members?: FamilyMemberConfig[];
  task_entities?: string[];
  meal_entities?: string[];
}

export interface LovelaceCardEditor {
  setConfig(config: FamilyHubCalendarConfig): void;
}

export interface HomeAssistantState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HomeAssistantState>;
  locale?: {
    language?: string;
  };
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  callWS?<T>(message: Record<string, unknown>): Promise<T>;
}

export interface LovelaceCard {
  hass?: HomeAssistant;
  setConfig(config: FamilyHubCalendarConfig): void;
  getCardSize?(): number;
}
