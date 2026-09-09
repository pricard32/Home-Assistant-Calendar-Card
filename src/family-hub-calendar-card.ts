import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { dateRangeForView, gridDaysForView, monthGridDays, normalizeConfig } from "./config";
import { detectLanguage, localize, type SupportedLanguage } from "./localize";
import {
  eventDuration,
  eventsOnDay,
  extractCalendarEvents,
  extractMeals,
  extractTasks,
  sortEvents,
  type HubEvent
} from "./models";
import type { CalendarView, FamilyHubCalendarConfig, HomeAssistant, LovelaceCard } from "./types";

@customElement("family-hub-calendar")
export class FamilyHubCalendarCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: FamilyHubCalendarConfig;
  @state() private currentDate = new Date();
  @state() private currentView = "week";
  @state() private activeLanguage: SupportedLanguage = "en";
  @state() private selectedEvent?: HubEvent;
  @state() private todoItemsByEntity: Record<string, Record<string, unknown>[]> = {};
  @state() private activeSection: "calendar" | "tasks" | "meals" = "calendar";
  @state() private orientation: "vertical" | "horizontal" = "vertical";
  @state() private hiddenCalendarEntities: Set<string> = new Set();

  private swipeStartX?: number;
  private lastDetectedLocale?: string;
  private fetchedTodoEntities = "";
  private modalReturnFocusElement?: HTMLElement;

  public setConfig(config: FamilyHubCalendarConfig): void {
    this.config = normalizeConfig(config);
    this.currentView = this.config.default_view || "week";
    this.orientation = this.config.layout_orientation === "horizontal" ? "horizontal" : "vertical";
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
    if (this.config && changedProps.has("hass")) {
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

    const calendarEvents = extractCalendarEvents(this.hass, this.config.calendars).filter(
      (event) => !this.hiddenCalendarEntities.has(event.calendarEntity)
    );
    const taskEvents =
      this.config.show_tasks === false
        ? []
        : extractTasks(this.hass, this.config.task_entities, this.todoItemsByEntity);
    const mealEvents = this.config.show_meals === false ? [] : extractMeals(this.hass, this.config.meal_entities);

    return sortEvents([...calendarEvents, ...taskEvents, ...mealEvents]);
  }

  private toggleCalendarVisibility(entity: string): void {
    const next = new Set(this.hiddenCalendarEntities);
    if (next.has(entity)) next.delete(entity);
    else next.add(entity);
    this.hiddenCalendarEntities = next;
  }

  private visibleEvents(): HubEvent[] {
    if (!this.config) return [];
    const { start, end } = dateRangeForView(this.currentDate, this.currentView as never, this.config.week_start_day || 1);
    return this.allEvents().filter((event) => event.end >= start && event.start <= end);
  }

  private periodLabel(): string {
    if (!this.config) return "";
    if (this.activeSection === "tasks") return this.t("tasks");
    const locale = this.activeLanguage === "fr" ? "fr-FR" : "en-US";
    if (this.activeSection === "meals" || this.currentView === "week" || this.currentView === "work_week") {
      const weekStartDay = this.config.week_start_day ?? 1;
      const view = this.activeSection === "meals" ? "week" : (this.currentView as CalendarView);
      const { start, end } = dateRangeForView(this.currentDate, view, weekStartDay);
      const fmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
      return `${fmt.format(start)} – ${fmt.format(end)}`;
    }
    if (this.currentView === "month") {
      return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(this.currentDate);
    }
    return this.formatDateTime(this.currentDate);
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
    if (this.activeSection === "meals") {
      next.setDate(next.getDate() + direction * 7);
      this.currentDate = next;
      return;
    }
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

  private editEvent(event: HubEvent): void {
    if (event.sourceType !== "calendar" || !event.calendarEntity) return;
    // Home Assistant's calendar integration has no generic "edit event" service, so we
    // open the entity's native more-info dialog, which is the best available action for
    // integrations that support in-place editing.
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: event.calendarEntity },
        bubbles: true,
        composed: true
      })
    );
    this.closeModal();
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
    if (!calendars.length) return nothing;
    return html`<div class="legend">
      ${calendars.map((calendar) => {
        const visible = !this.hiddenCalendarEntities.has(calendar.entity);
        return html`<button
          class="legend-item ${visible ? "" : "hidden"}"
          title=${visible ? this.t("hide_calendar") : this.t("show_calendar")}
          @click=${() => this.toggleCalendarVisibility(calendar.entity)}
        >
          <span class="legend-dot" style=${`background:${calendar.color || "var(--fhc-accent)"}`}></span>
          ${calendar.name || calendar.entity}
        </button>`;
      })}
    </div>`;
  }

  private renderSideNav() {
    if (!this.config) return nothing;
    const items: Array<{ id: "calendar" | "tasks" | "meals"; icon: string; label: string }> = [
      { id: "calendar", icon: "🗓", label: this.t("calendar") }
    ];
    if (this.config.show_tasks !== false) items.push({ id: "tasks", icon: "✓", label: this.t("tasks") });
    if (this.config.show_meals !== false) items.push({ id: "meals", icon: "🍽", label: this.t("meals") });

    return html`<nav class="side-nav">
      ${items.map(
        (item) => html`<button
          class="side-nav-btn ${this.activeSection === item.id ? "active" : ""}"
          title=${item.label}
          @click=${() => (this.activeSection = item.id)}
        >
          <span class="side-nav-icon">${item.icon}</span>
          <span class="side-nav-label">${item.label}</span>
        </button>`
      )}
    </nav>`;
  }

  private jumpToDay(day: Date): void {
    this.currentDate = new Date(day);
    if (this.config?.enabled_views?.includes("day")) this.currentView = "day";
  }

  private forecastForDay(day: Date): Record<string, unknown> | undefined {
    if (!this.hass || !this.config?.weather_entity) return undefined;
    const weather = this.hass.states[this.config.weather_entity];
    const forecast = Array.isArray(weather?.attributes.forecast)
      ? (weather!.attributes.forecast as Record<string, unknown>[])
      : [];
    const dayKey = day.toDateString();
    return forecast.find((entry) => {
      const value = entry.datetime;
      if (typeof value !== "string") return false;
      const parsed = new Date(value);
      return !Number.isNaN(parsed.getTime()) && parsed.toDateString() === dayKey;
    });
  }

  private renderDayWeather(day: Date) {
    if (
      !this.config ||
      this.config.weather_placement !== "day_cell" ||
      this.config.show_weather === false ||
      !this.config.weather_entity
    )
      return nothing;
    const entry = this.forecastForDay(day);
    if (!entry) return nothing;
    const high = entry.temperature;
    const low = entry.templow;
    return html`<span class="cell-weather" title=${String(entry.condition ?? "")}>
      ${this.weatherIcon(String(entry.condition ?? ""))}
      ${high !== undefined ? html`<span class="cell-weather-hi">${String(Math.round(Number(high)))}°</span>` : nothing}${low !== undefined
        ? html`<span class="cell-weather-lo">/${String(Math.round(Number(low)))}°</span>`
        : nothing}
    </span>`;
  }

  private renderMonthGrid() {
    if (!this.config) return nothing;
    const weekStartDay = this.config.week_start_day ?? 1;
    const includeAdjacent = this.config.show_empty_days !== false;
    const days = monthGridDays(this.currentDate, weekStartDay, includeAdjacent);
    const events = this.allEvents();
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    const locale = this.activeLanguage === "fr" ? "fr-FR" : "en-US";
    const weekdayLabels = days.slice(0, 7).map((day) => new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day));
    const todayKey = new Date().toDateString();
    const currentMonth = this.currentDate.getMonth();

    return html`<div class="month-grid">
      <div class="month-grid-header">${weekdayLabels.map((label) => html`<span>${label}</span>`)}</div>
      ${weeks.map(
        (week) => html`<div class="month-grid-row">
          ${week.map((day) => {
            const dayEvents = eventsOnDay(events, day);
            const isOutside = day.getMonth() !== currentMonth;
            const isToday = day.toDateString() === todayKey;
            const visible = dayEvents.slice(0, 3);
            const extra = dayEvents.length - visible.length;
            return html`<div class="month-cell ${isOutside ? "outside" : ""} ${isToday ? "today" : ""}">
              <div class="month-cell-top">
                <button class="month-cell-date" @click=${() => this.jumpToDay(day)}>${day.getDate()}</button>
                ${this.renderDayWeather(day)}
              </div>
              <div class="month-cell-events">
                ${visible.map(
                  (event) => html`<button
                    class="cell-event"
                    style=${`--event-color:${event.calendarColor}`}
                    title=${event.title}
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this.selectedEvent = event;
                    }}
                  >
                    <span class="cell-dot"></span>${event.title}
                  </button>`
                )}
                ${extra > 0 ? html`<span class="cell-more">+${extra} ${this.t("more")}</span>` : nothing}
              </div>
            </div>`;
          })}
        </div>`
      )}
    </div>`;
  }

  private renderWeekGrid() {
    if (!this.config) return nothing;
    const weekStartDay = this.config.week_start_day ?? 1;
    const days = gridDaysForView(this.currentDate, this.currentView as CalendarView, weekStartDay);
    const events = this.allEvents();
    const todayKey = new Date().toDateString();
    const locale = this.activeLanguage === "fr" ? "fr-FR" : "en-US";

    return html`<div class="week-grid">
      ${days.map((day) => {
        const dayEvents = eventsOnDay(events, day);
        const isToday = day.toDateString() === todayKey;
        return html`<section class="week-day ${isToday ? "today" : ""}">
          <header class="week-day-header">
            <span class="week-day-name">
              ${new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short" }).format(day)}
            </span>
            ${this.renderDayWeather(day)}
            <span class="week-day-count">${dayEvents.length}</span>
          </header>
          <div class="week-day-events">
            ${dayEvents.length
              ? dayEvents.map((event) => this.renderEventItem(event))
              : html`<div class="empty-day">${this.t("no_events")}</div>`}
          </div>
        </section>`;
      })}
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

  private renderTasksPanel() {
    const tasks = this.allEvents().filter((event) => event.sourceType === "task");
    if (!tasks.length)
      return html`<div class="empty">
        <span class="empty-icon">✅</span>
        <span>${this.t("no_tasks")}</span>
      </div>`;
    return html`<div class="event-list">${tasks.map((task) => this.renderEventItem(task))}</div>`;
  }

  private renderMealsPanel() {
    if (!this.config) return nothing;
    const weekStartDay = this.config.week_start_day ?? 1;
    const days = gridDaysForView(this.currentDate, "week", weekStartDay);
    const meals = this.allEvents().filter((event) => event.sourceType === "meal");
    const locale = this.activeLanguage === "fr" ? "fr-FR" : "en-US";
    const todayKey = new Date().toDateString();

    return html`<div class="week-grid">
      ${days.map((day) => {
        const dayMeals = eventsOnDay(meals, day);
        const isToday = day.toDateString() === todayKey;
        return html`<section class="week-day ${isToday ? "today" : ""}">
          <header class="week-day-header">
            <span class="week-day-name">
              ${new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short" }).format(day)}
            </span>
            <span class="week-day-count">${dayMeals.length}</span>
          </header>
          <div class="week-day-events">
            ${dayMeals.length
              ? dayMeals.map((meal) => this.renderEventItem(meal))
              : html`<div class="empty-day">${this.t("no_meals")}</div>`}
          </div>
        </section>`;
      })}
    </div>`;
  }

  private renderEvents() {
    if (this.activeSection === "tasks") return this.renderTasksPanel();
    if (this.activeSection === "meals") return this.renderMealsPanel();
    if (this.currentView === "month") return this.renderMonthGrid();
    if ((this.currentView === "week" || this.currentView === "work_week") && this.config?.show_empty_days !== false) {
      return this.renderWeekGrid();
    }

    const events = this.visibleEvents();
    if (!events.length)
      return html`<div class="empty">
        <span class="empty-icon">🗓️</span>
        <span>${this.t("no_events")}</span>
      </div>`;

    if (this.config?.grouped_by_calendar) {
      const groups = this.groupedEvents(events);
      return html`<div class="event-list">
        ${[...groups.entries()].map(
          ([calendarName, grouped]) => html`<section class="group">
            <h3>${calendarName}</h3>
            ${grouped.map((event) => this.renderEventItem(event))}
          </section>`
        )}
      </div>`;
    }

    return html`<div class="event-list">${events.map((event) => this.renderEventItem(event))}</div>`;
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
    const density = this.config.event_density || "comfortable";

    return html`<ha-card
      class="hub density-${density}"
      @touchstart=${this.onTouchStart}
      @touchend=${this.onTouchEnd}
      style=${`--fhc-font-family:${this.config.font_family || "inherit"};--fhc-radius:${this.config.border_radius}px;--fhc-bg:${theme.background || "inherit"};--fhc-surface:${theme.surface || "inherit"};--fhc-text:${theme.text || "inherit"};--fhc-accent:${theme.accent || "var(--primary-color)"};`}
    >
      <div class="layout">
        ${this.renderSideNav()}
        <div class="main-column">
          ${this.config.show_header !== false
            ? html`<header>
                <div class="left">
                  <h1>${title}</h1>
                  <span class="date-line">${this.periodLabel()}</span>
                  ${this.activeSection === "calendar" ? this.renderCalendarLegend() : nothing}
                </div>
                <div class="right">
                  ${this.activeSection !== "tasks"
                    ? html`<div class="nav-group">
                          <button class="icon-nav" aria-label=${this.t("previous")} @click=${() => this.movePeriod(-1)}>
                            ‹
                          </button>
                          <button class="today-btn" @click=${() => (this.currentDate = new Date())}>
                            ${this.t("today")}
                          </button>
                          <button class="icon-nav" aria-label=${this.t("next")} @click=${() => this.movePeriod(1)}>
                            ›
                          </button>
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
                        </label>`
                    : nothing}
                </div>
              </header>`
            : nothing}

          ${this.activeSection === "calendar"
            ? html`<nav class="views">
                <div class="segmented">
                  ${views.map(
                    (view) =>
                      html`<button
                        class=${view === this.currentView ? "active" : ""}
                        @click=${() => (this.currentView = view)}
                      >
                        ${this.t(view)}
                      </button>`
                  )}
                </div>
              </nav>`
            : nothing}

          <div class="content ${this.config.show_sidebar === false ? "no-sidebar" : ""}">
            <main class="orientation-${this.orientation}">${this.renderEvents()}</main>
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
        </div>
      </div>
    </ha-card>${this.renderModal()}`;
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
      padding: 20px 22px;
      font-family: var(--fhc-font-family, inherit);
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06), 0 12px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.12));
    }
    .hub.density-compact {
      --fhc-event-min-h: 48px;
      --fhc-event-pad: 10px 12px;
      --fhc-event-font: 0.92em;
      --fhc-month-cell-h: 92px;
      --fhc-chip-min-h: 20px;
      --fhc-chip-pad: 3px 6px;
    }
    .hub.density-comfortable {
      --fhc-event-min-h: 56px;
      --fhc-event-pad: 14px 16px;
      --fhc-event-font: 1em;
      --fhc-month-cell-h: 108px;
      --fhc-chip-min-h: 24px;
      --fhc-chip-pad: 4px 7px;
    }
    .hub.density-large {
      --fhc-event-min-h: 76px;
      --fhc-event-pad: 18px 20px;
      --fhc-event-font: 1.2em;
      --fhc-month-cell-h: 136px;
      --fhc-chip-min-h: 32px;
      --fhc-chip-pad: 6px 10px;
    }
    .hub.density-extra_large {
      --fhc-event-min-h: 96px;
      --fhc-event-pad: 22px 26px;
      --fhc-event-font: 1.45em;
      --fhc-month-cell-h: 168px;
      --fhc-chip-min-h: 40px;
      --fhc-chip-pad: 8px 14px;
    }
    .layout {
      display: flex;
      gap: 18px;
      align-items: flex-start;
    }
    .main-column {
      flex: 1;
      min-width: 0;
    }
    .side-nav {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 84px;
      flex-shrink: 0;
    }
    .side-nav-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border: none;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 6%, transparent));
      color: inherit;
      border-radius: 14px;
      padding: 12px 6px;
      min-height: 60px;
      cursor: pointer;
      opacity: 0.72;
      transition: background 150ms ease, opacity 150ms ease, box-shadow 150ms ease, transform 150ms ease;
    }
    .side-nav-btn:hover {
      opacity: 1;
      background: var(--fhc-accent-soft);
      transform: translateY(-1px);
    }
    .side-nav-btn.active {
      background: var(--fhc-accent, var(--primary-color));
      color: #fff;
      opacity: 1;
      box-shadow: 0 6px 16px color-mix(in srgb, var(--fhc-accent, var(--primary-color)) 45%, transparent);
    }
    .side-nav-icon {
      font-size: 1.4rem;
      line-height: 1;
    }
    .side-nav-label {
      font-size: 0.68em;
      font-weight: 700;
      text-align: center;
      letter-spacing: 0.01em;
    }
    header {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 12px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.14));
    }
    .left {
      display: grid;
      gap: 6px;
      min-width: 0;
    }
    .left h1 {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .date-line {
      display: inline-flex;
      align-self: start;
      opacity: 0.85;
      font-size: 0.85em;
      font-weight: 600;
      text-transform: capitalize;
      background: var(--fhc-accent-soft);
      color: var(--fhc-accent, var(--primary-color));
      padding: 4px 10px;
      border-radius: 999px;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 2px;
    }
    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78em;
      font-weight: 500;
      opacity: 0.9;
      border: none;
      cursor: pointer;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 5%, transparent));
      color: inherit;
      padding: 5px 10px;
      border-radius: 999px;
      transition: opacity 120ms ease, background 120ms ease;
    }
    .legend-item:hover {
      background: var(--fhc-accent-soft);
    }
    .legend-item.hidden {
      opacity: 0.4;
      text-decoration: line-through;
    }
    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
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
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border: none;
      border-radius: 999px;
      background: transparent;
      color: inherit;
      font-size: 1.4rem;
      line-height: 1;
      cursor: pointer;
      transition: background 120ms ease;
    }
    .icon-nav:hover {
      background: var(--fhc-accent-soft);
    }
    .today-btn {
      border: none;
      background: transparent;
      color: inherit;
      font-weight: 700;
      font-size: 0.9em;
      padding: 10px 16px;
      min-height: 44px;
      border-radius: 999px;
      cursor: pointer;
      transition: background 120ms ease;
    }
    .today-btn:hover {
      background: var(--fhc-accent-soft);
    }
    .date-jump input[type="date"] {
      border: 1px solid var(--divider-color, #374151);
      border-radius: 10px;
      padding: 8px 10px;
      background: transparent;
      color: inherit;
      font-size: 0.85em;
      min-height: 44px;
      box-sizing: border-box;
    }
    .views {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin: 0 0 16px;
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
      padding: 10px 16px;
      min-height: 40px;
      border-radius: 9px;
      font-size: 0.9em;
      font-weight: 600;
      cursor: pointer;
      opacity: 0.7;
      transition: background 120ms ease, opacity 120ms ease;
    }
    .segmented button:hover {
      opacity: 1;
    }
    .segmented button.active {
      background: var(--fhc-accent, var(--primary-color));
      color: #fff;
      opacity: 1;
      box-shadow: 0 4px 10px color-mix(in srgb, var(--fhc-accent, var(--primary-color)) 40%, transparent);
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
    .event-list {
      display: grid;
      gap: 8px;
    }
    main.orientation-horizontal .event-list {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 6px;
    }
    main.orientation-horizontal .event-list .event {
      flex: 0 0 260px;
    }
    main.orientation-horizontal .week-grid {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 6px;
    }
    main.orientation-horizontal .week-day {
      flex: 0 0 240px;
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
    .month-grid {
      display: grid;
      gap: 6px;
    }
    .month-grid-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
      font-size: 0.75em;
      font-weight: 700;
      opacity: 0.55;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      text-align: center;
      padding-bottom: 4px;
    }
    .month-grid-row {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
    }
    .month-cell {
      min-height: var(--fhc-month-cell-h, 108px);
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.16));
      border-radius: 12px;
      padding: 6px;
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 3px;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 3%, transparent));
      transition: box-shadow 120ms ease;
    }
    .month-cell.outside {
      opacity: 0.38;
    }
    .month-cell.today {
      border-color: var(--fhc-accent, var(--primary-color));
      box-shadow: inset 0 0 0 1.5px var(--fhc-accent, var(--primary-color));
      background: var(--fhc-accent-soft);
    }
    .month-cell-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
    }
    .month-cell-date {
      border: none;
      background: transparent;
      color: inherit;
      font-weight: 700;
      font-size: var(--fhc-event-font, 0.9em);
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .month-cell.today .month-cell-date {
      background: var(--fhc-accent, var(--primary-color));
      color: #fff;
    }
    .cell-weather {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 0.72em;
      opacity: 0.75;
      white-space: nowrap;
    }
    .cell-weather-hi {
      font-weight: 700;
    }
    .cell-weather-lo {
      opacity: 0.7;
    }
    .month-cell-events {
      display: grid;
      gap: 3px;
      align-content: start;
      overflow: hidden;
    }
    .cell-event {
      display: flex;
      align-items: center;
      gap: 5px;
      border: none;
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 18%, transparent);
      color: inherit;
      text-align: left;
      font-size: var(--fhc-event-font, 0.8em);
      font-weight: 600;
      padding: var(--fhc-chip-pad, 4px 7px);
      min-height: var(--fhc-chip-min-h, 24px);
      border-radius: 999px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: background 120ms ease;
    }
    .cell-event:hover {
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 30%, transparent);
    }
    .cell-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--event-color, var(--fhc-accent));
      flex-shrink: 0;
    }
    .cell-more {
      font-size: 0.75em;
      opacity: 0.6;
      padding: 2px 4px;
    }
    .week-grid {
      display: grid;
      gap: 10px;
    }
    .week-day {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.16));
      border-radius: 14px;
      padding: 12px;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 3%, transparent));
    }
    .week-day.today {
      border-color: var(--fhc-accent, var(--primary-color));
      box-shadow: inset 0 0 0 1.5px var(--fhc-accent, var(--primary-color));
    }
    .week-day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 0.85em;
      font-weight: 700;
      text-transform: capitalize;
    }
    .week-day-count {
      opacity: 0.6;
      font-weight: 600;
    }
    .week-day-events {
      display: grid;
      gap: 6px;
    }
    .empty-day {
      opacity: 0.55;
      font-size: 0.85em;
      padding: 6px 2px;
    }
    .event {
      width: 100%;
      position: relative;
      display: grid;
      grid-template-columns: auto 26px 1fr auto;
      gap: 12px;
      align-items: center;
      text-align: left;
      cursor: pointer;
      min-height: var(--fhc-event-min-h, 56px);
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.16));
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 8%, var(--fhc-surface, color-mix(in srgb, currentColor 4%, transparent)));
      border-radius: 14px;
      padding: var(--fhc-event-pad, 14px 16px);
      color: inherit;
      font: inherit;
      font-size: var(--fhc-event-font, 1em);
      transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
    }
    .event:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 16%, var(--fhc-surface, transparent));
    }
    .event-bar {
      width: 5px;
      align-self: stretch;
      border-radius: 4px;
      background: var(--event-color, var(--fhc-accent, var(--primary-color)));
    }
    .event-icon {
      font-size: 1.2rem;
      opacity: 0.8;
    }
    .event-body {
      display: grid;
      gap: 3px;
      min-width: 0;
    }
    .event-title {
      font-weight: 700;
      font-size: 1.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .event.completed .event-title {
      text-decoration: line-through;
      opacity: 0.6;
    }
    .event-meta {
      font-size: 0.82em;
      opacity: 0.65;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .event-time {
      font-size: 0.85em;
      opacity: 0.75;
      white-space: nowrap;
    }
    .event-time.today {
      color: var(--fhc-accent, var(--primary-color));
      font-weight: 700;
    }
    .weather-current {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1rem;
    }
    .weather-icon {
      font-size: 1.6rem;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--fhc-accent-soft);
      flex-shrink: 0;
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
      padding: 18px 20px;
      background: linear-gradient(135deg, var(--event-color, var(--fhc-accent)), color-mix(in srgb, var(--event-color, var(--fhc-accent)) 60%, #000));
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
      width: 40px;
      height: 40px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 1.1rem;
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
      padding: 12px 18px;
      min-height: 44px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 0.92em;
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
    @media (max-width: 700px) {
      .layout {
        flex-direction: column;
      }
      .side-nav {
        flex-direction: row;
        width: 100%;
        overflow-x: auto;
      }
    }
  `;
}
