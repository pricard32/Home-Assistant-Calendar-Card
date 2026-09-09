import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { normalizeConfig } from "./config";
import type { FamilyHubCalendarConfig, LovelaceCardEditor } from "./types";

@customElement("family-hub-calendar-editor")
export class FamilyHubCalendarEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: unknown;
  @state() private config?: FamilyHubCalendarConfig;

  public setConfig(config: FamilyHubCalendarConfig): void {
    this.config = normalizeConfig(config);
  }

  private updateValue(key: keyof FamilyHubCalendarConfig, value: unknown): void {
    if (!this.config) return;
    const next = {
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

  private updateCalendars(value: string): void {
    if (!this.config) return;
    const existing = new Map(this.config.calendars.map((calendar) => [calendar.entity, calendar]));
    const entities = value
      .split("\n")
      .map((entity) => entity.trim())
      .filter(Boolean)
      .map((entity) => existing.get(entity) ?? { entity });
    this.updateValue("calendars", entities);
  }

  protected render() {
    if (!this.config) return html``;

    return html`<div class="form">
      <label>
        Title
        <input
          type="text"
          .value=${this.config.title || ""}
          @input=${(e: Event) => this.updateValue("title", (e.target as HTMLInputElement).value)}
        />
      </label>
      <label>
        Calendar entities (one per line)
        <textarea
          rows="6"
          @input=${(e: Event) => this.updateCalendars((e.target as HTMLTextAreaElement).value)}
        >${this.config.calendars.map((calendar) => calendar.entity).join("\n")}</textarea>
      </label>
      <label>
        Default view
        <select
          .value=${this.config.default_view || "week"}
          @change=${(e: Event) =>
            this.updateValue("default_view", (e.target as HTMLSelectElement).value as FamilyHubCalendarConfig["default_view"])}
        >
          <option value="day">Day</option>
          <option value="3day">3-Day</option>
          <option value="week">Week</option>
          <option value="work_week">Work Week</option>
          <option value="month">Month</option>
          <option value="agenda">Agenda</option>
          <option value="timeline">Timeline</option>
        </select>
      </label>
      <label>
        Language
        <select
          .value=${this.config.language || "en"}
          @change=${(e: Event) => this.updateValue("language", (e.target as HTMLSelectElement).value)}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </label>
      <label>
        Weather entity
        <input
          type="text"
          .value=${this.config.weather_entity || ""}
          @input=${(e: Event) => this.updateValue("weather_entity", (e.target as HTMLInputElement).value)}
        />
      </label>
      <label>
        Show tasks
        <input
          type="checkbox"
          .checked=${this.config.show_tasks !== false}
          @change=${(e: Event) => this.updateValue("show_tasks", (e.target as HTMLInputElement).checked)}
        />
      </label>
      <label>
        Show meals
        <input
          type="checkbox"
          .checked=${this.config.show_meals !== false}
          @change=${(e: Event) => this.updateValue("show_meals", (e.target as HTMLInputElement).checked)}
        />
      </label>
    </div>`;
  }

  static styles = css`
    .form {
      display: grid;
      gap: 12px;
    }
    label {
      display: grid;
      gap: 4px;
      font-size: 14px;
    }
  `;
}
