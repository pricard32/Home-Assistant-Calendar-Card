import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { normalizeConfig, THEME_PRESETS } from "./config";
import type {
  CalendarSourceConfig,
  FamilyHubCalendarConfig,
  FamilyMemberConfig,
  LovelaceCardEditor
} from "./types";

/**
 * The real Home Assistant frontend object has far more fields than our
 * minimal `HomeAssistant` type. The editor forwards it as-is to native
 * `ha-form` / `ha-entity-picker` elements, so it is typed loosely here.
 */
type HassLike = Record<string, unknown>;

interface SelectOption {
  value: string;
  label: string;
}

const VIEW_OPTIONS: SelectOption[] = [
  { value: "day", label: "Day" },
  { value: "3day", label: "3-Day" },
  { value: "week", label: "Week" },
  { value: "work_week", label: "Work Week" },
  { value: "month", label: "Month" },
  { value: "agenda", label: "Agenda" },
  { value: "timeline", label: "Timeline" }
];

const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" }
];

const WEEK_START_OPTIONS: SelectOption[] = [
  { value: "1", label: "Monday" },
  { value: "0", label: "Sunday" }
];

const TIME_FORMAT_OPTIONS: SelectOption[] = [
  { value: "12h", label: "12-hour" },
  { value: "24h", label: "24-hour" }
];

const FONT_SIZE_OPTIONS: SelectOption[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" }
];

const DENSITY_OPTIONS: SelectOption[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "large", label: "Large (big display)" },
  { value: "extra_large", label: "Extra large (big display)" }
];

const WEATHER_PLACEMENT_OPTIONS: SelectOption[] = [
  { value: "header", label: "Header" },
  { value: "sidebar", label: "Sidebar" },
  { value: "day_cell", label: "Day cell" },
  { value: "agenda", label: "Agenda" }
];

const ORIENTATION_OPTIONS: SelectOption[] = [
  { value: "vertical", label: "Vertical" },
  { value: "horizontal", label: "Horizontal" }
];

const PALETTE = ["#4F86F7", "#4CAF50", "#FF9800", "#7E57C2", "#F06292", "#26A69A", "#EF4444", "#FBBF24"];

const LABELS: Record<string, string> = {
  title: "Title",
  default_view: "Default view",
  enabled_views: "Enabled views",
  language: "Language",
  week_start_day: "Week starts on",
  time_format: "Time format",
  font_size: "Font size",
  font_family: "Font family",
  border_radius: "Corner radius",
  event_density: "Event density",
  weather_entity: "Weather entity",
  weather_placement: "Weather placement",
  task_entities: "Task (to-do) entities",
  meal_entities: "Meal plan entities",
  show_header: "Show header",
  show_sidebar: "Show sidebar",
  show_weather: "Show weather",
  show_tasks: "Show tasks",
  show_meals: "Show meals",
  compact_mode: "Compact mode",
  grouped_by_calendar: "Group events by calendar",
  show_empty_days: "Show adjacent month days in month grid",
  layout_orientation: "Default layout orientation"
};

const MAIN_SCHEMA = [
  { name: "title", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "default_view", selector: { select: { mode: "dropdown", options: VIEW_OPTIONS } } },
      { name: "language", selector: { select: { mode: "dropdown", options: LANGUAGE_OPTIONS } } }
    ]
  },
  { name: "enabled_views", selector: { select: { multiple: true, mode: "list", options: VIEW_OPTIONS } } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "week_start_day", selector: { select: { mode: "dropdown", options: WEEK_START_OPTIONS } } },
      { name: "time_format", selector: { select: { mode: "dropdown", options: TIME_FORMAT_OPTIONS } } },
      { name: "font_size", selector: { select: { mode: "dropdown", options: FONT_SIZE_OPTIONS } } },
      { name: "event_density", selector: { select: { mode: "dropdown", options: DENSITY_OPTIONS } } },
      { name: "layout_orientation", selector: { select: { mode: "dropdown", options: ORIENTATION_OPTIONS } } }
    ]
  },
  { name: "font_family", selector: { text: {} } },
  { name: "border_radius", selector: { number: { min: 0, max: 32, step: 1, mode: "slider" } } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "show_header", selector: { boolean: {} } },
      { name: "show_sidebar", selector: { boolean: {} } },
      { name: "show_weather", selector: { boolean: {} } },
      { name: "show_tasks", selector: { boolean: {} } },
      { name: "show_meals", selector: { boolean: {} } },
      { name: "compact_mode", selector: { boolean: {} } },
      { name: "grouped_by_calendar", selector: { boolean: {} } },
      { name: "show_empty_days", selector: { boolean: {} } }
    ]
  },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "weather_entity", selector: { entity: { domain: "weather" } } },
      { name: "weather_placement", selector: { select: { mode: "dropdown", options: WEATHER_PLACEMENT_OPTIONS } } }
    ]
  },
  { name: "task_entities", selector: { entity: { multiple: true, domain: "todo" } } },
  { name: "meal_entities", selector: { entity: { multiple: true } } }
];

const THEME_FIELDS: Array<{ key: keyof NonNullable<FamilyHubCalendarConfig["theme_colors"]>; label: string }> = [
  { key: "background", label: "Background" },
  { key: "surface", label: "Surface" },
  { key: "text", label: "Text" },
  { key: "accent", label: "Accent" }
];

let familyMemberCounter = 0;

@customElement("family-hub-calendar-editor")
export class FamilyHubCalendarEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HassLike;
  @state() private config?: FamilyHubCalendarConfig;
  @state() private newCalendarEntity = "";

  public setConfig(config: FamilyHubCalendarConfig): void {
    this.config = normalizeConfig(config);
  }

  private computeLabel = (schema: { name: string }): string => LABELS[schema.name] ?? schema.name;

  private updateValue(key: keyof FamilyHubCalendarConfig, value: unknown): void {
    if (!this.config) return;
    const next: FamilyHubCalendarConfig = {
      ...this.config,
      [key]: value
    };
    this.config = next;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: next },
        bubbles: true,
        composed: true
      })
    );
  }

  private onFormChanged(event: CustomEvent): void {
    if (!this.config) return;
    const value = event.detail.value as Record<string, unknown>;
    const next: FamilyHubCalendarConfig = { ...this.config, ...value } as FamilyHubCalendarConfig;
    this.config = next;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: next },
        bubbles: true,
        composed: true
      })
    );
  }

  private formData(): Record<string, unknown> {
    if (!this.config) return {};
    const data: Record<string, unknown> = {};
    const collect = (schema: Array<Record<string, unknown>>) => {
      schema.forEach((entry) => {
        if (entry.type === "grid" && Array.isArray(entry.schema)) {
          collect(entry.schema as Array<Record<string, unknown>>);
          return;
        }
        const name = entry.name as string;
        if (!name) return;
        data[name] = (this.config as unknown as Record<string, unknown>)[name];
      });
    };
    collect(MAIN_SCHEMA);
    // Normalize week_start_day to string for the select selector.
    if (data.week_start_day !== undefined) data.week_start_day = String(data.week_start_day);
    return data;
  }

  // --- Calendars -----------------------------------------------------

  private addCalendar(entity: string): void {
    if (!this.config || !entity) return;
    if (this.config.calendars.some((calendar) => calendar.entity === entity)) return;
    const calendars: CalendarSourceConfig[] = [...this.config.calendars, { entity, enabled: true }];
    this.updateValue("calendars", calendars);
    this.newCalendarEntity = "";
  }

  private updateCalendar(index: number, patch: Partial<CalendarSourceConfig>): void {
    if (!this.config) return;
    const calendars = this.config.calendars.map((calendar, i) => (i === index ? { ...calendar, ...patch } : calendar));
    this.updateValue("calendars", calendars);
  }

  private removeCalendar(index: number): void {
    if (!this.config) return;
    const calendars = this.config.calendars.filter((_, i) => i !== index);
    this.updateValue("calendars", calendars);
  }

  // --- Shared color picker -----------------------------------------------

  private renderColorField(value: string, onChange: (color: string) => void) {
    return html`<div class="color-field">
      <input type="color" class="swatch" .value=${value || "#4F86F7"} @input=${(e: Event) => onChange((e.target as HTMLInputElement).value)} />
      <div class="palette">
        ${PALETTE.map(
          (color) => html`<button
            class="palette-swatch ${color.toLowerCase() === (value || "").toLowerCase() ? "selected" : ""}"
            style=${`background:${color}`}
            title=${color}
            @click=${() => onChange(color)}
          ></button>`
        )}
      </div>
    </div>`;
  }

  private renderCalendarsSection() {
    if (!this.config) return nothing;
    return html`<div class="section">
      <h3>Calendars</h3>
      <p class="hint">Choose which calendar entities appear on the card, and customize their name and color.</p>
      ${this.config.calendars.map(
        (calendar, index) => html`<div class="row calendar-row">
          <div class="row-main">
            <span class="entity-id">${calendar.entity}</span>
            <input
              type="text"
              placeholder="Display name"
              .value=${calendar.name || ""}
              @input=${(e: Event) => this.updateCalendar(index, { name: (e.target as HTMLInputElement).value })}
            />
            ${this.renderColorField(calendar.color || "#4F86F7", (color) => this.updateCalendar(index, { color }))}
          </div>
          <label class="enabled-toggle">
            <input
              type="checkbox"
              .checked=${calendar.enabled !== false}
              @change=${(e: Event) => this.updateCalendar(index, { enabled: (e.target as HTMLInputElement).checked })}
            />
            Enabled
          </label>
          <button class="icon-btn" title="Remove" @click=${() => this.removeCalendar(index)}>✕</button>
        </div>`
      )}
      <div class="add-row">
        ${this.renderEntityPicker(this.newCalendarEntity, ["calendar"], "Add a calendar entity", (value) =>
          this.addCalendar(value)
        )}
      </div>
    </div>`;
  }

  // --- Family members --------------------------------------------------

  private updateFamilyMember(index: number, patch: Partial<FamilyMemberConfig>): void {
    if (!this.config) return;
    const members = (this.config.family_members ?? []).map((member, i) =>
      i === index ? { ...member, ...patch } : member
    );
    this.updateValue("family_members", members);
  }

  private addFamilyMember(): void {
    if (!this.config) return;
    familyMemberCounter += 1;
    const member: FamilyMemberConfig = { id: `member_${familyMemberCounter}`, name: "New member", color: "#60a5fa" };
    this.updateValue("family_members", [...(this.config.family_members ?? []), member]);
  }

  private removeFamilyMember(index: number): void {
    if (!this.config) return;
    const members = (this.config.family_members ?? []).filter((_, i) => i !== index);
    this.updateValue("family_members", members);
  }

  private renderFamilyMembersSection() {
    if (!this.config) return nothing;
    const members = this.config.family_members ?? [];
    return html`<div class="section">
      <h3>Family members</h3>
      <p class="hint">Add household members to color-code assigned events and tasks.</p>
      ${members.map(
        (member, index) => html`<div class="row member-row">
          <div class="row-main">
            <input
              type="text"
              placeholder="Name"
              .value=${member.name}
              @input=${(e: Event) => this.updateFamilyMember(index, { name: (e.target as HTMLInputElement).value })}
            />
            <input
              type="text"
              placeholder="Avatar URL (optional)"
              .value=${member.avatar || ""}
              @input=${(e: Event) => this.updateFamilyMember(index, { avatar: (e.target as HTMLInputElement).value })}
            />
            ${this.renderColorField(member.color || "#60a5fa", (color) => this.updateFamilyMember(index, { color }))}
          </div>
          <button class="icon-btn" title="Remove" @click=${() => this.removeFamilyMember(index)}>✕</button>
        </div>`
      )}
      <button class="add-btn" @click=${() => this.addFamilyMember()}>+ Add family member</button>
    </div>`;
  }

  // --- Theme colors ------------------------------------------------------

  private updateThemeColor(key: keyof NonNullable<FamilyHubCalendarConfig["theme_colors"]>, value: string): void {
    if (!this.config) return;
    this.updateValue("theme_colors", { ...this.config.theme_colors, [key]: value });
  }

  private applyThemePreset(presetId: string): void {
    if (!this.config) return;
    const preset = THEME_PRESETS.find((entry) => entry.id === presetId);
    if (!preset) return;
    this.config = { ...this.config, theme_preset: presetId, theme_colors: { ...preset.colors } };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: true,
        composed: true
      })
    );
  }

  private renderThemeSection() {
    if (!this.config) return nothing;
    const colors = this.config.theme_colors ?? {};
    const activePreset = this.config.theme_preset ?? "custom";
    return html`<div class="section">
      <h3>Theme</h3>
      <p class="hint">Pick a starter theme, then fine-tune individual colors below.</p>
      <select
        class="theme-select"
        .value=${activePreset}
        @change=${(e: Event) => {
          const value = (e.target as HTMLSelectElement).value;
          if (value === "custom") {
            this.updateValue("theme_preset", "custom");
          } else {
            this.applyThemePreset(value);
          }
        }}
      >
        ${THEME_PRESETS.map((preset) => html`<option value=${preset.id}>${preset.label}</option>`)}
        <option value="custom">Custom</option>
      </select>
      <div class="theme-grid">
        ${THEME_FIELDS.map(
          (field) => html`<label class="theme-field">
            ${field.label}
            <input
              type="text"
              .value=${colors[field.key] || ""}
              @input=${(e: Event) => {
                this.updateValue("theme_preset", "custom");
                this.updateThemeColor(field.key, (e.target as HTMLInputElement).value);
              }}
            />
            ${this.renderColorField(colors[field.key] || "#60a5fa", (color) => {
              this.updateValue("theme_preset", "custom");
              this.updateThemeColor(field.key, color);
            })}
          </label>`
        )}
      </div>
    </div>`;
  }

  // --- Entity picker helper -----------------------------------------------

  private renderEntityPicker(
    value: string,
    includeDomains: string[],
    label: string,
    onPick: (entityId: string) => void
  ) {
    const picker = customElements.get("ha-entity-picker");
    if (picker && this.hass) {
      return html`<ha-entity-picker
        .hass=${this.hass}
        .value=${value}
        .includeDomains=${includeDomains}
        .label=${label}
        allow-custom-entity
        @value-changed=${(e: CustomEvent) => {
          const id = e.detail.value as string;
          if (id) onPick(id);
        }}
      ></ha-entity-picker>`;
    }
    // Fallback for environments without the HA frontend custom elements (e.g. tests).
    return html`<input
      type="text"
      placeholder=${label}
      .value=${value}
      @change=${(e: Event) => {
        const input = e.target as HTMLInputElement;
        onPick(input.value.trim());
        input.value = "";
      }}
    />`;
  }

  private renderForm() {
    const formEl = customElements.get("ha-form");
    if (formEl && this.hass) {
      return html`<ha-form
        .hass=${this.hass}
        .data=${this.formData()}
        .schema=${MAIN_SCHEMA}
        .computeLabel=${this.computeLabel}
        @value-changed=${(e: CustomEvent) => this.onFormChanged(e)}
      ></ha-form>`;
    }
    return html`<p class="hint">Full form controls require the Home Assistant frontend.</p>`;
  }

  protected render() {
    if (!this.config) return html``;

    return html`<div class="editor">
      <div class="section">${this.renderForm()}</div>
      ${this.renderCalendarsSection()} ${this.renderFamilyMembersSection()} ${this.renderThemeSection()}
    </div>`;
  }

  static styles = css`
    .editor {
      display: grid;
      gap: 16px;
      padding: 4px 0 12px;
    }
    .section {
      display: grid;
      gap: 8px;
      padding: 12px;
      border: 1px solid var(--divider-color, #374151);
      border-radius: 12px;
    }
    .section h3 {
      margin: 0;
      font-size: 1rem;
    }
    .hint {
      margin: 0;
      font-size: 0.85em;
      opacity: 0.7;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color, #374151);
    }
    .row:last-of-type {
      border-bottom: none;
    }
    .row-main {
      display: grid;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }
    .entity-id {
      font-size: 0.75em;
      opacity: 0.65;
      font-family: monospace;
    }
    .swatch {
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 8px;
      background: none;
      cursor: pointer;
      flex-shrink: 0;
    }
    input[type="text"] {
      width: 100%;
      box-sizing: border-box;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, #374151);
      background: var(--card-background-color, transparent);
      color: inherit;
    }
    .enabled-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85em;
      white-space: nowrap;
    }
    .icon-btn {
      border: none;
      background: none;
      cursor: pointer;
      font-size: 1rem;
      opacity: 0.6;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .icon-btn:hover {
      opacity: 1;
      background: color-mix(in srgb, currentColor 10%, transparent);
    }
    .add-row {
      margin-top: 4px;
    }
    .add-btn {
      justify-self: start;
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px dashed var(--divider-color, #374151);
      background: none;
      cursor: pointer;
      color: var(--primary-color, inherit);
    }
    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 8px;
    }
    .theme-field {
      display: grid;
      gap: 4px;
      font-size: 0.85em;
    }
    .theme-select {
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, #374151);
      background: var(--card-background-color, transparent);
      color: inherit;
      justify-self: start;
    }
    .color-field {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .palette {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    .palette-swatch {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      padding: 0;
    }
    .palette-swatch.selected {
      border-color: var(--primary-text-color, #111827);
    }
  `;
}
