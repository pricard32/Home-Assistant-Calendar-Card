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
  ├─ Interaction layer (swipe, prev/next, today, date jump, modal)
  └─ Rendering layer (header, sidebar, weather, grouped/merged timeline)
```

## 2) Component Breakdown

- `family-hub-calendar` (main card)
  - navigation + animated view switching
  - true calendar-grid month view (full weeks, adjacent-month days, "+N more" overflow)
  - week/work-week grid showing every day (with a "no events" placeholder) or a compact agenda list
  - merged or grouped calendars
  - event modal (details, copy, edit/delete service hooks, map launch)
  - tasks, meals, weather sections
- `family-hub-calendar-editor` (visual editor)
  - Fully configurable through the Lovelace UI — no YAML required
  - Native `ha-form` powered fields for title, default/enabled views, language, week start, time format, font, border radius, event density, section toggles (including "show empty days"), weather entity/placement, and task/meal entities
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
weather_placement: header

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
event_density: comfortable
compact_mode: false
border_radius: 16
show_empty_days: true # render full week/month grids even for days without events
theme_preset: auto # auto | midnight | light | sunset | forest | ocean | custom

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
