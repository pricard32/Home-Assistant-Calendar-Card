# Family Hub Calendar (Home Assistant Custom Card)

A premium, touch-first, wall-display family planning dashboard inspired by Skylight Calendar, Cozyla Calendar Plus 2, and FamilyWall, while remaining fully local inside Home Assistant.

## 1) Complete Architecture

```text
Home Assistant Entities/Services
  ├─ calendar.*          (events)
  ├─ todo.*              (tasks)
  ├─ weather.*           (weather)
  └─ optional meal.*     (meal plans)
          │
          ▼
FamilyHubCalendarCard (LitElement)
  ├─ Config layer (normalizeConfig, defaults)
  ├─ Localization layer (en/fr + auto-detect)
  ├─ Data model layer (merge/sort events+tasks+meals)
  ├─ View state layer (day/3-day/week/work week/month/agenda/timeline)
  ├─ Interaction layer (section nav, swipe, prev/next, today, date jump, clickable legend calendar toggles, modal)
  └─ Rendering layer (header, sidebar, weather, grouped/merged timeline)
```

## 2) Component Breakdown

- `family-hub-calendar` (main card)
  - left-hand side panel to switch between Calendar / Tasks / Meal Planner sections
  - per-calendar visibility toggling from colored header filter chips — each chip shows the calendar's name, a live event count for the current period, and can be clicked to hide/show it (dimmed + strikethrough when hidden), instead of a separate side-panel list that could overlap the calendar grid
  - compact weather badge (icon + current temperature) in the header, alongside a full weather panel in the sidebar
  - navigation + animated view switching; the day/3-day/agenda vertical/horizontal layout is set from the visual editor's "layout orientation" field only, so the live card UI stays uncluttered
  - true calendar-grid month view (full weeks, adjacent-month days, "+N more" overflow) with the month/year name shown in the header
  - week/work-week view rendered as a true hourly time grid: day columns with an hour ruler, events positioned and sized by their actual start/end time (overlapping events share the column width), a live "now" indicator line, and an all-day event strip above the grid — like a physical/digital wall calendar
  - merged or grouped calendars
  - large, touch-friendly, color-tinted event bubbles sized for wall-mounted touch panels, with four event-density presets (`compact`, `comfortable`, `large`, `extra_large`) — the two larger presets are tuned for big/wall-mounted displays and also control the time grid's hour row height
  - per-day weather badge (icon + high/low) shown in month grid cells and in the week time grid's day headers when `weather_placement: day_cell` is configured; forecasts are fetched on demand via Home Assistant's `weather/get_forecasts` command so day-cell weather works even on modern HA versions that no longer expose it as a state attribute
  - floating quick-add button that opens Home Assistant's native "add event" dialog for the first visible calendar
  - event modal (details, copy, delete, map launch; "Edit" opens the calendar entity's native more-info dialog since Home Assistant has no generic edit-event service)
  - tasks, meals, weather sections
- `family-hub-calendar-editor` (visual editor)
  - Fully configurable through the Lovelace UI — no YAML required
  - Native `ha-form` powered fields for title, default/enabled views, language, week start, time format, font, border radius, event density (4 levels), layout orientation, section toggles (including "show empty days"), weather entity/placement, and task/meal entities
  - Calendar picker (`ha-entity-picker`, filtered to `calendar.*`) with per-calendar name, color picker (native swatch + quick palette), and enabled toggle
  - Family member list editor (name, avatar, color picker) for assignment color-coding
  - Theme preset selector (Home Assistant auto, Midnight, Light, Sunset, Forest, Ocean, or Custom) plus individual color fields/pickers (background/surface/text/accent), accepting hex values or CSS variables

## 3) Data Model

Unified model (`HubEvent`) supports:
- calendar events (recurring/all-day/multi-day/overlap represented by start/end/allDay)
- tasks with due date, completion, category, priority, assignee
- meals by day and meal type

Each item includes source metadata and color:
- `calendarEntity`, `calendarName`, `calendarColor`, `sourceType`

## 4) Configuration Schema

```yaml
type: custom:family-hub-calendar
title: Family Hub Calendar
calendars:
  - entity: calendar.family
    name: Family
    color: "#4F86F7"
    enabled: true
  - entity: calendar.school
    name: School
    color: "#4CAF50"
  - entity: calendar.sports
    name: Sports
    color: "#FF9800"

default_view: week
enabled_views: [day, 3day, week, work_week, month, agenda, timeline]
grouped_by_calendar: false

weather_entity: weather.home
weather_placement: header # header | day_cell (day_cell shows a small icon + high/low badge in each month/week day cell)

show_tasks: true
task_entities:
  - todo.family

show_meals: true
meal_entities:
  - sensor.meal_planner

language: en
week_start_day: 1
time_format: 12h
font_size: medium
font_family: "Inter"
show_header: true
show_sidebar: true
show_weather: true
event_density: comfortable # compact | comfortable | large | extra_large (large/extra_large are for big wall-mounted displays)
compact_mode: false
border_radius: 16
show_empty_days: true # month grid also shows adjacent-month days to fill every week row (week view always shows all 7 days as time-grid columns)
theme_preset: auto # auto | midnight | light | sunset | forest | ocean | custom
layout_orientation: vertical # vertical | horizontal (default arrangement for day/3-day/week/work-week/agenda views)

theme_colors:
  background: "#0f172a"
  surface: "#1e293b"
  text: "#f8fafc"
  accent: "#60a5fa"

family_member_colors:
  mom: "#ef4444"
  dad: "#3b82f6"
  kid1: "#10b981"

family_members:
  - id: mom
    name: Mom
    avatar: /local/avatars/mom.jpg
```

## 5) UI Mockup (ASCII)

```text
┌────────────────────────────────────────────────────────────────────┐
│ Family Hub Calendar   Tue, Sep 9, 9:10 AM   [<] [Today] [>] [📅]  │
├────────────────────────────────────────────────────────────────────┤
│ Day 3-Day Week WorkWeek Month Agenda Timeline      [EN/FR]        │
├───────────────────────────────────────┬────────────────────────────┤
│ Main Schedule                         │ Sidebar                    │
│ ● Family - Dentist 10:00              │ Weather                    │
│ ● School - Parent Meeting 14:00       │ Daily Forecast             │
│ ● Dinner: Pasta Night                 │ Daily Summary              │
│ ● Task: Buy Groceries                 │ Birthdays / Widgets        │
└───────────────────────────────────────┴────────────────────────────┘
```

## 6) Folder Structure

```text
src/
  config.ts
  localize.ts
  models.ts
  types.ts
  family-hub-calendar-card.ts
  family-hub-calendar-editor.ts
  index.ts
  translations/
    en.json
    fr.json
test/
  config.test.ts
family-hub-calendar-card.js
hacs.json
package.json
tsconfig.json
vitest.config.ts
```

## 7) LitElement Implementation

- Strong typed config and data models
- Instant view switch state changes
- Touch swipe navigation
- Modal details and actions
- Home Assistant service call hooks for edit/delete
- Runtime language switching and automatic HA locale detection
- Weather/task/meal rendering via configured entities

## 8) Home Assistant Integration Examples

Add resource:

```yaml
url: /local/family-hub-calendar-card.js
type: module
```

Lovelace card:

```yaml
type: custom:family-hub-calendar
title: Family Hub
calendars:
  - entity: calendar.family
  - entity: calendar.school
weather_entity: weather.home
task_entities:
  - todo.family
meal_entities:
  - sensor.meal_planner
default_view: week
```

## 9) Localization Architecture

- Translation files: `src/translations/en.json`, `src/translations/fr.json`
- Resolver: `detectLanguage(hass, config.language)`
- Runtime switching: language dropdown in card UI
- `Intl.DateTimeFormat` used for locale-aware date/time formatting
- Easy extension path: add new JSON dictionary and include in `localize.ts`

## 10) HACS Packaging Structure

- `hacs.json` included with card name and filename
- Build output committed at the repository root: `family-hub-calendar-card.js`
- Ready for inclusion in a standard HACS custom repository

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Notes on roadmap parity

This implementation provides a production-ready foundation with all required architecture layers and initial feature coverage (views, navigation, modal, tasks, meals, weather, localization, UI editor, and HACS packaging). Advanced behaviors like full drag/drop editing, deep recurring-event mutation support, and richer widget ecosystem are future-ready via the typed model/config architecture already included.
