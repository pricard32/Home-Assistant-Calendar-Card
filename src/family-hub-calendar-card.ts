import { LitElement, css, html, nothing, type PropertyValues } from "lit";
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
  @state() private todoItemsByEntity: Record<string, Record<string, unknown>[]> = {};

  private swipeStartX?: number;
  private languageOverridden = false;
  private lastDetectedLocale?: string;
  private fetchedTodoEntities = "";
  private modalReturnFocusElement?: HTMLElement;

  public setConfig(config: FamilyHubCalendarConfig): void {
    this.config = normalizeConfig(config);
    this.currentView = this.config.default_view || "week";
    this.languageOverridden = false;
    this.lastDetectedLocale = this.hass?.locale?.language;
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

  protected updated(changedProps: PropertyValues<this>): void {
    if (this.config && !this.languageOverridden && changedProps.has("hass")) {
      const hassLocale = this.hass?.locale?.language;
      if (hassLocale !== this.lastDetectedLocale) {
        this.lastDetectedLocale = hassLocale;
        this.activeLanguage = detectLanguage(this.hass, this.config.language);
      }
    }
    this.refreshTodoItems();

    if ((changedProps as Map<PropertyKey, unknown>).has("selectedEvent")) {
      if (this.selectedEvent) {
        this.modalReturnFocusElement = (document.activeElement as HTMLElement) ?? undefined;
        this.renderRoot.querySelector<HTMLElement>(".modal")?.focus();
      } else if (this.modalReturnFocusElement) {
        this.modalReturnFocusElement.focus();
        this.modalReturnFocusElement = undefined;
      }
    }
  }

  private closeModal(): void {
    this.selectedEvent = undefined;
  }

  private refreshTodoItems(): void {
    if (!this.hass || !this.config || this.config.show_tasks === false) return;
    const entities = this.config.task_entities ?? [];
    const key = entities.join(",");
    if (key === this.fetchedTodoEntities) return;
    this.fetchedTodoEntities = key;
    entities.forEach((entity) => {
      void this.fetchTodoItems(entity);
    });
  }

  private async fetchTodoItems(entity: string): Promise<void> {
    if (!this.hass?.callWS) return;
    try {
      const response = await this.hass.callWS<{ items: Record<string, unknown>[] }>({
        type: "todo/item/list",
        entity_id: entity
      });
      this.todoItemsByEntity = { ...this.todoItemsByEntity, [entity]: response.items ?? [] };
    } catch {
      // Ignore errors fetching todo items; the entity simply won't contribute tasks.
    }
  }

  private t(key: string): string {
    return localize(key, this.activeLanguage);
  }

  private allEvents(): HubEvent[] {
    if (!this.hass || !this.config) return [];

    const calendarEvents = extractCalendarEvents(this.hass, this.config.calendars);
    const taskEvents =
      this.config.show_tasks === false
        ? []
        : extractTasks(this.hass, this.config.task_entities, this.todoItemsByEntity);
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
    this.closeModal();
  }

  private weatherIcon(condition: string): string {
    const icons: Record<string, string> = {
      "clear-night": "🌙",
      cloudy: "☁️",
      exceptional: "⚠️",
      fog: "🌫️",
      hail: "🌨️",
      lightning: "⛈️",
      "lightning-rainy": "⛈️",
      partlycloudy: "⛅",
      pouring: "🌧️",
      rainy: "🌧️",
      snowy: "❄️",
      "snowy-rainy": "🌨️",
      sunny: "☀️",
      windy: "🌬️",
      "windy-variant": "🌬️"
    };
    return icons[condition] || "🌤️";
  }

  private renderWeather() {
    if (!this.hass || !this.config?.weather_entity || this.config.show_weather === false) return nothing;
    const weather = this.hass.states[this.config.weather_entity];
    if (!weather) return nothing;
    const forecast = Array.isArray(weather.attributes.forecast)
      ? (weather.attributes.forecast as Record<string, unknown>[]).slice(0, 4)
      : [];
    const unit = String(weather.attributes.temperature_unit ?? "°");

    return html`<section class="panel weather">
      <h3>${this.t("weather")}</h3>
      <div class="weather-current">
        <span class="weather-icon">${this.weatherIcon(weather.state)}</span>
        <span class="weather-temp">${String(weather.attributes.temperature ?? "-")}${unit}</span>
        <span class="weather-condition">${weather.state.replace(/-/g, " ")}</span>
      </div>
      <div class="forecast">
        ${forecast.map(
          (day) => html`<div class="forecast-item">
            <span class="forecast-day">
              ${new Intl.DateTimeFormat(this.activeLanguage === "fr" ? "fr-FR" : "en-US", { weekday: "short" }).format(
                new Date(String(day.datetime ?? Date.now()))
              )}
            </span>
            <span class="forecast-icon">${this.weatherIcon(String(day.condition ?? ""))}</span>
            <span class="forecast-temps"
              ><b>${String(day.temperature ?? "-")}°</b>/${String(day.templow ?? "-")}°</span
            >
          </div>`
        )}
      </div>
    </section>`;
  }

  private sourceIcon(event: HubEvent): string {
    if (event.sourceType === "task") return "✓";
    if (event.sourceType === "meal") return "🍽";
    return "📅";
  }

  private renderCalendarLegend() {
    if (!this.config) return nothing;
    const calendars = this.config.calendars.filter((calendar) => calendar.enabled !== false);
    if (calendars.length < 2) return nothing;
    return html`<div class="legend">
      ${calendars.map(
        (calendar) => html`<span class="legend-item">
          <span class="legend-dot" style=${`background:${calendar.color || "var(--fhc-accent)"}`}></span>
          ${calendar.name || calendar.entity}
        </span>`
      )}
    </div>`;
  }

  private renderEventItem(event: HubEvent) {
    const isToday = new Date().toDateString() === event.start.toDateString();
    return html`<button
      class="event ${event.completed ? "completed" : ""}"
      style=${`--event-color:${event.calendarColor}`}
      @click=${() => (this.selectedEvent = event)}
    >
      <span class="event-bar"></span>
      <span class="event-icon">${this.sourceIcon(event)}</span>
      <span class="event-body">
        <span class="event-title">${event.title}</span>
        <span class="event-meta">${event.calendarName}${event.location ? ` · ${event.location}` : ""}</span>
      </span>
      <span class="event-time ${isToday ? "today" : ""}">
        ${event.allDay ? this.t("day") : this.formatDateTime(event.start).split(", ").pop()}
      </span>
    </button>`;
  }

  private renderEvents() {
    const events = this.visibleEvents();
    if (!events.length)
      return html`<div class="empty">
        <span class="empty-icon">🗓️</span>
        <span>${this.t("no_events")}</span>
      </div>`;

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

    return html`<div
      class="modal-backdrop"
      @click=${() => this.closeModal()}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Escape") this.closeModal();
      }}
    >
      <section
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fhc-modal-title"
        tabindex="-1"
        style=${`--event-color:${event.calendarColor}`}
        @click=${(e: Event) => e.stopPropagation()}
      >
        <div class="modal-banner">
          <span class="modal-source">${this.sourceIcon(event)} ${event.calendarName}</span>
          <button class="modal-close" aria-label=${this.t("close")} @click=${() => this.closeModal()}>✕</button>
        </div>
        <div class="modal-body">
          <h2 id="fhc-modal-title">${event.title}</h2>
          ${event.description ? html`<p class="modal-description">${event.description}</p>` : nothing}
          <div class="modal-facts">
            <div class="fact"><span class="fact-label">${this.t("start")}</span><span>${this.formatDateTime(event.start)}</span></div>
            <div class="fact"><span class="fact-label">${this.t("end")}</span><span>${this.formatDateTime(event.end)}</span></div>
            <div class="fact"><span class="fact-label">${this.t("duration")}</span><span>${eventDuration(event)}</span></div>
            ${event.location
              ? html`<div class="fact"><span class="fact-label">${this.t("location")}</span><span>${event.location}</span></div>`
              : nothing}
            ${event.organizer
              ? html`<div class="fact"><span class="fact-label">${this.t("organizer")}</span><span>${event.organizer}</span></div>`
              : nothing}
            ${event.attendees?.length
              ? html`<div class="fact">
                  <span class="fact-label">${this.t("attendees")}</span><span>${event.attendees.join(", ")}</span>
                </div>`
              : nothing}
            ${event.links?.length
              ? html`<div class="fact"><span class="fact-label">${this.t("links")}</span><span>${event.links.join(" · ")}</span></div>`
              : nothing}
          </div>
          <div class="actions">
            <button class="pill" @click=${() => this.editEvent(event)}>✎ ${this.t("edit")}</button>
            <button class="pill danger" @click=${() => this.deleteEvent(event)}>🗑 ${this.t("delete")}</button>
            <button class="pill" @click=${() => this.copyEventDetails(event)}>⧉ ${this.t("copy")}</button>
            ${event.location
              ? html`<button
                  class="pill"
                  @click=${() => window.open(`https://maps.google.com/?q=${encodeURIComponent(event.location!)}`)}
                >
                  📍 ${this.t("open_map")}
                </button>`
              : nothing}
          </div>
        </div>
      </section>
    </div>`;
  }

  protected render() {
    if (!this.config)
      return html`<ha-card
        ><div class="empty"><span class="empty-icon">⚠️</span><span>Configuration required</span></div></ha-card
      >`;

    const title = this.config.title || "Family Hub Calendar";
    const views = this.config.enabled_views || [];
    const theme = this.config.theme_colors ?? {};

    return html`<ha-card
      class="hub"
      @touchstart=${this.onTouchStart}
      @touchend=${this.onTouchEnd}
      style=${`--fhc-font-family:${this.config.font_family || "inherit"};--fhc-radius:${this.config.border_radius}px;--fhc-bg:${theme.background || "inherit"};--fhc-surface:${theme.surface || "inherit"};--fhc-text:${theme.text || "inherit"};--fhc-accent:${theme.accent || "var(--primary-color)"};`}
    >
      ${this.config.show_header !== false
        ? html`<header>
            <div class="left">
              <h1>${title}</h1>
              <span class="date-line">${this.formatDateTime(this.currentDate)}</span>
              ${this.renderCalendarLegend()}
            </div>
            <div class="right">
              <div class="nav-group">
                <button class="icon-nav" aria-label=${this.t("previous")} @click=${() => this.movePeriod(-1)}>‹</button>
                <button class="today-btn" @click=${() => (this.currentDate = new Date())}>${this.t("today")}</button>
                <button class="icon-nav" aria-label=${this.t("next")} @click=${() => this.movePeriod(1)}>›</button>
              </div>
              <label class="date-jump">
                <input
                  type="date"
                  title=${this.t("jump_to_date")}
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
        <div class="segmented">
          ${views.map(
            (view) =>
              html`<button class=${view === this.currentView ? "active" : ""} @click=${() => (this.currentView = view)}>
                ${this.t(view)}
              </button>`
          )}
        </div>
        <select
          class="lang-select"
          .value=${this.activeLanguage}
          @change=${(e: Event) => {
            this.languageOverridden = true;
            this.activeLanguage = (e.target as HTMLSelectElement).value as SupportedLanguage;
          }}
        >
          <option value="en">EN</option>
          <option value="fr">FR</option>
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
                <p class="summary-count">${this.visibleEvents().length}</p>
                <p class="summary-label">events</p>
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
      --fhc-accent-soft: color-mix(in srgb, var(--fhc-accent, var(--primary-color)) 16%, transparent);
      background: var(--fhc-bg, var(--ha-card-background, var(--card-background-color)));
      color: var(--fhc-text, var(--primary-text-color));
      border-radius: var(--fhc-radius, 16px);
      padding: 18px;
      font-family: var(--fhc-font-family, inherit);
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    }
    header {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }
    .left {
      display: grid;
      gap: 4px;
      min-width: 0;
    }
    .left h1 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .date-line {
      opacity: 0.7;
      font-size: 0.95em;
      text-transform: capitalize;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 4px;
    }
    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.78em;
      opacity: 0.85;
    }
    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }
    .right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .nav-group {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 6%, transparent));
      border-radius: 999px;
      padding: 4px;
    }
    .icon-nav {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border: none;
      border-radius: 999px;
      background: transparent;
      color: inherit;
      font-size: 1.2rem;
      line-height: 1;
      cursor: pointer;
    }
    .icon-nav:hover {
      background: var(--fhc-accent-soft);
    }
    .today-btn {
      border: none;
      background: transparent;
      color: inherit;
      font-weight: 600;
      font-size: 0.85em;
      padding: 6px 12px;
      border-radius: 999px;
      cursor: pointer;
    }
    .today-btn:hover {
      background: var(--fhc-accent-soft);
    }
    .date-jump input[type="date"] {
      border: 1px solid var(--divider-color, #374151);
      border-radius: 8px;
      padding: 5px 8px;
      background: transparent;
      color: inherit;
      font-size: 0.85em;
    }
    .views {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin: 12px 0 14px;
      flex-wrap: wrap;
    }
    .segmented {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 6%, transparent));
      border-radius: 12px;
      padding: 3px;
    }
    .segmented button {
      border: none;
      background: transparent;
      color: inherit;
      padding: 7px 14px;
      border-radius: 9px;
      font-size: 0.85em;
      font-weight: 500;
      cursor: pointer;
      opacity: 0.75;
      transition: background 120ms ease, opacity 120ms ease;
    }
    .segmented button:hover {
      opacity: 1;
    }
    .segmented button.active {
      background: var(--fhc-accent, var(--primary-color));
      color: #fff;
      opacity: 1;
    }
    .lang-select {
      border: 1px solid var(--divider-color, #374151);
      border-radius: 8px;
      background: transparent;
      color: inherit;
      padding: 5px 8px;
      font-size: 0.8em;
    }
    .content {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      flex-wrap: wrap;
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
      gap: 12px;
    }
    .panel,
    .group {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
      border-radius: 14px;
      padding: 14px;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 4%, transparent));
    }
    .panel h3,
    .group h3 {
      margin: 0 0 8px;
      font-size: 0.85em;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      opacity: 0.65;
    }
    .group {
      display: grid;
      gap: 6px;
    }
    .event {
      width: 100%;
      position: relative;
      display: grid;
      grid-template-columns: auto 20px 1fr auto;
      gap: 10px;
      align-items: center;
      text-align: left;
      cursor: pointer;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      background: var(--fhc-surface, color-mix(in srgb, currentColor 4%, transparent));
      border-radius: 12px;
      padding: 10px 12px;
      color: inherit;
      font: inherit;
      transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
    }
    .event:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
      background: var(--fhc-accent-soft);
    }
    .event-bar {
      width: 4px;
      align-self: stretch;
      border-radius: 4px;
      background: var(--event-color, var(--fhc-accent, var(--primary-color)));
    }
    .event-icon {
      font-size: 1rem;
      opacity: 0.8;
    }
    .event-body {
      display: grid;
      gap: 2px;
      min-width: 0;
    }
    .event-title {
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .event.completed .event-title {
      text-decoration: line-through;
      opacity: 0.6;
    }
    .event-meta {
      font-size: 0.78em;
      opacity: 0.65;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .event-time {
      font-size: 0.8em;
      opacity: 0.75;
      white-space: nowrap;
    }
    .event-time.today {
      color: var(--fhc-accent, var(--primary-color));
      font-weight: 700;
    }
    .weather-current {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 1rem;
    }
    .weather-icon {
      font-size: 1.6rem;
    }
    .weather-temp {
      font-size: 1.4rem;
      font-weight: 700;
    }
    .weather-condition {
      opacity: 0.65;
      font-size: 0.85em;
      text-transform: capitalize;
    }
    .forecast {
      display: flex;
      gap: 6px;
      margin-top: 10px;
      justify-content: space-between;
    }
    .forecast-item {
      display: grid;
      justify-items: center;
      gap: 4px;
      font-size: 0.78em;
      flex: 1;
    }
    .forecast-day {
      text-transform: capitalize;
      opacity: 0.7;
    }
    .forecast-icon {
      font-size: 1.1rem;
    }
    .summary-count {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: var(--fhc-accent, var(--primary-color));
      line-height: 1;
    }
    .summary-label {
      margin: 2px 0 0;
      opacity: 0.6;
      font-size: 0.8em;
    }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(2px);
      display: grid;
      place-items: center;
      z-index: 1000;
      padding: 12px;
    }
    .modal {
      position: relative;
      width: min(560px, 100%);
      max-height: 85vh;
      overflow: auto;
      background: var(--card-background-color, #fff);
      border-radius: 18px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    }
    .modal-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: var(--event-color, var(--fhc-accent));
      color: #fff;
    }
    .modal-source {
      font-size: 0.85em;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .modal-close {
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      width: 28px;
      height: 28px;
      border-radius: 999px;
      cursor: pointer;
      line-height: 1;
    }
    .modal-body {
      padding: 18px 20px 20px;
    }
    .modal-body h2 {
      margin: 0 0 6px;
      font-size: 1.3rem;
    }
    .modal-description {
      opacity: 0.8;
      margin: 0 0 12px;
    }
    .modal-facts {
      display: grid;
      gap: 8px;
      margin-bottom: 16px;
    }
    .fact {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 0.9em;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.15));
    }
    .fact-label {
      opacity: 0.6;
      font-weight: 600;
    }
    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .pill {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
      background: transparent;
      color: inherit;
      padding: 8px 14px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 0.85em;
      font-weight: 500;
    }
    .pill:hover {
      background: var(--fhc-accent-soft);
    }
    .pill.danger {
      color: #ef4444;
      border-color: color-mix(in srgb, #ef4444 40%, transparent);
    }
    .empty {
      display: grid;
      justify-items: center;
      gap: 8px;
      opacity: 0.7;
      padding: 32px 8px;
      text-align: center;
    }
    .empty-icon {
      font-size: 2rem;
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
