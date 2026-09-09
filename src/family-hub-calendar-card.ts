import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { dateRangeForView, normalizeConfig } from "./config";
import { detectLanguage, localize, type SupportedLanguage } from "./localize";
import { eventDuration, extractCalendarEvents, extractMeals, extractTasks, sortEvents, type HubEvent } from "./models";
import type { FamilyHubCalendarConfig, HomeAssistant, LovelaceCard } from "./types";

@customElement("family-hub-calendar")
export class FamilyHubCalendarCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: FamilyHubCalendarConfig;
  @state() private currentDate = new Date();
  @state() private currentView = "week";
  @state() private activeLanguage: SupportedLanguage = "en";
  @state() private selectedEvent?: HubEvent;

  private swipeStartX?: number;

  public setConfig(config: FamilyHubCalendarConfig): void {
    this.config = normalizeConfig(config);
    this.currentView = this.config.default_view || "week";
    this.activeLanguage = detectLanguage(this.hass, this.config.language);
  }

  public getCardSize(): number {
    return this.config?.compact_mode ? 6 : 9;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./family-hub-calendar-editor");
    return document.createElement("family-hub-calendar-editor");
  }

  public static getStubConfig(): FamilyHubCalendarConfig {
    return {
      type: "custom:family-hub-calendar",
      calendars: [{ entity: "calendar.family" }]
    };
  }

  protected updated(): void {
    if (this.config) {
      this.activeLanguage = detectLanguage(this.hass, this.config.language);
    }
  }

  private t(key: string): string {
    return localize(key, this.activeLanguage);
  }

  private allEvents(): HubEvent[] {
    if (!this.hass || !this.config) return [];

    const calendarEvents = extractCalendarEvents(this.hass, this.config.calendars);
    const taskEvents = this.config.show_tasks === false ? [] : extractTasks(this.hass, this.config.task_entities);
    const mealEvents = this.config.show_meals === false ? [] : extractMeals(this.hass, this.config.meal_entities);

    return sortEvents([...calendarEvents, ...taskEvents, ...mealEvents]);
  }

  private visibleEvents(): HubEvent[] {
    if (!this.config) return [];
    const { start, end } = dateRangeForView(this.currentDate, this.currentView as never, this.config.week_start_day || 1);
    return this.allEvents().filter((event) => event.end >= start && event.start <= end);
  }

  private formatDateTime(value: Date): string {
    const language = this.activeLanguage === "fr" ? "fr-FR" : "en-US";
    const use24h = this.config?.time_format === "24h";
    return new Intl.DateTimeFormat(language, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: !use24h
    }).format(value);
  }

  private movePeriod(direction: 1 | -1): void {
    const next = new Date(this.currentDate);
    if (this.currentView === "month") next.setMonth(next.getMonth() + direction);
    else if (this.currentView === "week" || this.currentView === "work_week") next.setDate(next.getDate() + direction * 7);
    else if (this.currentView === "3day") next.setDate(next.getDate() + direction * 3);
    else next.setDate(next.getDate() + direction);
    this.currentDate = next;
  }

  private onTouchStart(event: TouchEvent): void {
    this.swipeStartX = event.touches[0]?.clientX;
  }

  private onTouchEnd(event: TouchEvent): void {
    if (this.swipeStartX === undefined) return;
    const diff = (event.changedTouches[0]?.clientX || 0) - this.swipeStartX;
    if (Math.abs(diff) > 30) this.movePeriod(diff < 0 ? 1 : -1);
    this.swipeStartX = undefined;
  }

  private groupedEvents(events: HubEvent[]): Map<string, HubEvent[]> {
    const groups = new Map<string, HubEvent[]>();
    events.forEach((event) => {
      const key = event.calendarName;
      const existing = groups.get(key) || [];
      existing.push(event);
      groups.set(key, existing);
    });
    return groups;
  }

  private async copyEventDetails(event: HubEvent): Promise<void> {
    const lines = [
      event.title,
      `${this.t("start")}: ${this.formatDateTime(event.start)}`,
      `${this.t("end")}: ${this.formatDateTime(event.end)}`,
      `${this.t("calendar")}: ${event.calendarName}`,
      event.description || ""
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard?.writeText(lines);
  }

  private async editEvent(event: HubEvent): Promise<void> {
    if (event.sourceType !== "calendar" || !this.hass) return;
    await this.hass.callService("calendar", "edit_event", {
      entity_id: event.calendarEntity,
      event_id: event.id
    });
  }

  private async deleteEvent(event: HubEvent): Promise<void> {
    if (event.sourceType !== "calendar" || !this.hass) return;
    await this.hass.callService("calendar", "delete_event", {
      entity_id: event.calendarEntity,
      event_id: event.id
    });
    this.selectedEvent = undefined;
  }

  private renderWeather() {
    if (!this.hass || !this.config?.weather_entity || this.config.show_weather === false) return nothing;
    const weather = this.hass.states[this.config.weather_entity];
    if (!weather) return nothing;
    const forecast = Array.isArray(weather.attributes.forecast)
      ? (weather.attributes.forecast as Record<string, unknown>[]).slice(0, 3)
      : [];

    return html`<section class="panel weather">
      <h3>${this.t("weather")}</h3>
      <div class="weather-current">${weather.state} · ${String(weather.attributes.temperature ?? "-")}</div>
      <div class="forecast">
        ${forecast.map(
          (day) => html`<div class="forecast-item">
            <span>${String(day.datetime ?? "")}</span>
            <span>${String(day.condition ?? "")}</span>
            <span>${String(day.temperature ?? "-")}/${String(day.templow ?? "-")}</span>
            <span>${String(day.precipitation_probability ?? "0")}%</span>
          </div>`
        )}
      </div>
    </section>`;
  }

  private renderEventItem(event: HubEvent) {
    return html`<button class="event" @click=${() => (this.selectedEvent = event)}>
      <span class="dot" style=${`background:${event.calendarColor}`}></span>
      <span class="event-title">${event.title}</span>
      <span class="event-time">${this.formatDateTime(event.start)}</span>
    </button>`;
  }

  private renderEvents() {
    const events = this.visibleEvents();
    if (!events.length) return html`<div class="empty">${this.t("no_events")}</div>`;

    if (this.config?.grouped_by_calendar) {
      const groups = this.groupedEvents(events);
      return html`${[...groups.entries()].map(
        ([calendarName, grouped]) => html`<section class="group">
          <h3>${calendarName}</h3>
          ${grouped.map((event) => this.renderEventItem(event))}
        </section>`
      )}`;
    }

    return html`${events.map((event) => this.renderEventItem(event))}`;
  }

  private renderModal() {
    if (!this.selectedEvent) return nothing;
    const event = this.selectedEvent;

    return html`<div class="modal-backdrop" @click=${() => (this.selectedEvent = undefined)}>
      <section class="modal" @click=${(e: Event) => e.stopPropagation()}>
        <h2>${this.t("details")}</h2>
        <h3>${event.title}</h3>
        <p>${event.description || ""}</p>
        <p><strong>${this.t("start")}:</strong> ${this.formatDateTime(event.start)}</p>
        <p><strong>${this.t("end")}:</strong> ${this.formatDateTime(event.end)}</p>
        <p><strong>${this.t("duration")}:</strong> ${eventDuration(event)}</p>
        <p><strong>${this.t("calendar")}:</strong> ${event.calendarName}</p>
        ${event.location ? html`<p><strong>${this.t("location")}:</strong> ${event.location}</p>` : nothing}
        ${event.organizer ? html`<p><strong>${this.t("organizer")}:</strong> ${event.organizer}</p>` : nothing}
        ${event.attendees?.length
          ? html`<p><strong>${this.t("attendees")}:</strong> ${event.attendees.join(", ")}</p>`
          : nothing}
        ${event.links?.length
          ? html`<p><strong>${this.t("links")}:</strong> ${event.links.join(" · ")}</p>`
          : nothing}
        <div class="actions">
          <button @click=${() => this.editEvent(event)}>${this.t("edit")}</button>
          <button @click=${() => this.deleteEvent(event)}>${this.t("delete")}</button>
          <button @click=${() => this.copyEventDetails(event)}>${this.t("copy")}</button>
          ${event.location
            ? html`<button @click=${() => window.open(`https://maps.google.com/?q=${encodeURIComponent(event.location!)}`)}>
                ${this.t("open_map")}
              </button>`
            : nothing}
        </div>
      </section>
    </div>`;
  }

  protected render() {
    if (!this.config) return html`<ha-card><div class="empty">Configuration required</div></ha-card>`;

    const title = this.config.title || "Family Hub Calendar";
    const views = this.config.enabled_views || [];

    return html`<ha-card
      class="hub"
      @touchstart=${this.onTouchStart}
      @touchend=${this.onTouchEnd}
      style=${`--fhc-font-family:${this.config.font_family || "inherit"};--fhc-radius:${this.config.border_radius}px;`}
    >
      ${this.config.show_header !== false
        ? html`<header>
            <div class="left">
              <h1>${title}</h1>
              <span>${this.formatDateTime(this.currentDate)}</span>
            </div>
            <div class="right">
              <button @click=${() => this.movePeriod(-1)}>${this.t("previous")}</button>
              <button @click=${() => (this.currentDate = new Date())}>${this.t("today")}</button>
              <button @click=${() => this.movePeriod(1)}>${this.t("next")}</button>
              <label>
                ${this.t("jump_to_date")}
                <input
                  type="date"
                  @change=${(e: Event) => {
                    const input = e.target as HTMLInputElement;
                    const value = input.value ? new Date(input.value) : new Date();
                    if (!Number.isNaN(value.getTime())) this.currentDate = value;
                  }}
                />
              </label>
            </div>
          </header>`
        : nothing}

      <nav class="views">
        ${views.map(
          (view) => html`<button class=${view === this.currentView ? "active" : ""} @click=${() => (this.currentView = view)}>
            ${this.t(view)}
          </button>`
        )}
        <select
          .value=${this.activeLanguage}
          @change=${(e: Event) =>
            (this.activeLanguage = (e.target as HTMLSelectElement).value as SupportedLanguage)}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </nav>

      <div class="content ${this.config.show_sidebar === false ? "no-sidebar" : ""}">
        <main>${this.renderEvents()}</main>
        ${this.config.show_sidebar === false
          ? nothing
          : html`<aside>
              ${this.renderWeather()}
              <section class="panel summary">
                <h3>${this.t("daily_summary")}</h3>
                <p>${this.visibleEvents().length} events</p>
              </section>
            </aside>`}
      </div>
      ${this.renderModal()}
    </ha-card>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    .hub {
      border-radius: var(--fhc-radius, 16px);
      padding: 16px;
      font-family: var(--fhc-font-family, inherit);
      overflow: hidden;
    }
    header,
    .views,
    .content,
    .actions,
    .forecast-item {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .views {
      margin: 8px 0 12px;
      justify-content: flex-start;
    }
    .views button.active {
      background: var(--primary-color);
      color: white;
    }
    .content {
      align-items: flex-start;
    }
    .content.no-sidebar aside {
      display: none;
    }
    main {
      flex: 1;
      min-width: 0;
      display: grid;
      gap: 8px;
      transition: transform 150ms ease, opacity 150ms ease;
    }
    aside {
      width: min(35%, 320px);
      display: grid;
      gap: 8px;
    }
    .panel,
    .event,
    .group {
      border: 1px solid var(--divider-color, #374151);
      border-radius: 12px;
      padding: 10px;
      background: color-mix(in srgb, var(--ha-card-background, #111827) 85%, white 15%);
    }
    .event {
      width: 100%;
      display: grid;
      grid-template-columns: 12px 1fr auto;
      gap: 8px;
      align-items: center;
      text-align: left;
      cursor: pointer;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .event-title {
      font-weight: 600;
    }
    .event-time {
      opacity: 0.85;
      font-size: 0.9em;
    }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: grid;
      place-items: center;
      z-index: 1000;
      padding: 12px;
    }
    .modal {
      width: min(680px, 100%);
      max-height: 80vh;
      overflow: auto;
      background: var(--card-background-color);
      border-radius: 14px;
      padding: 16px;
    }
    .actions {
      justify-content: flex-start;
      margin-top: 8px;
    }
    .empty {
      opacity: 0.8;
      padding: 8px;
    }
    @media (max-width: 900px) {
      .content {
        flex-direction: column;
      }
      aside {
        width: 100%;
      }
    }
  `;
}
