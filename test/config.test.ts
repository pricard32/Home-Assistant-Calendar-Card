import { describe, expect, it } from "vitest";
import { dateRangeForView, gridDaysForView, monthGridDays, normalizeConfig } from "../src/config";
import { detectLanguage, localize } from "../src/localize";

describe("normalizeConfig", () => {
  it("applies defaults and keeps configured calendars", () => {
    const config = normalizeConfig({
      type: "custom:family-hub-calendar",
      calendars: [{ entity: "calendar.family", enabled: false }]
    });

    expect(config.default_view).toBe("week");
    expect(config.calendars[0].enabled).toBe(false);
    expect(config.show_weather).toBe(true);
  });

  it("throws when no calendars are configured", () => {
    expect(() =>
      normalizeConfig({
        type: "custom:family-hub-calendar",
        calendars: []
      })
    ).toThrow(/at least one calendar/i);
  });
});

describe("dateRangeForView", () => {
  it("returns work week starting Monday when configured", () => {
    const date = new Date("2026-09-09T12:00:00Z");
    const range = dateRangeForView(date, "work_week", 1);

    expect([range.start.getFullYear(), range.start.getMonth(), range.start.getDate()]).toEqual([2026, 8, 7]);
    expect([range.end.getFullYear(), range.end.getMonth(), range.end.getDate()]).toEqual([2026, 8, 11]);
  });
});

describe("monthGridDays", () => {
  it("fills complete weeks aligned to the configured week start", () => {
    const date = new Date("2026-09-09T12:00:00Z");
    const days = monthGridDays(date, 1, true);

    expect(days.length % 7).toBe(0);
    expect(days[0].getDay()).toBe(1);
    expect(days[days.length - 1].getDay()).toBe(0);
    expect(days.some((day) => day.getMonth() === 8 && day.getDate() === 1)).toBe(true);
    expect(days.some((day) => day.getMonth() === 8 && day.getDate() === 30)).toBe(true);
  });

  it("excludes adjacent-month days when includeAdjacentMonths is false", () => {
    const date = new Date("2026-09-09T12:00:00Z");
    const days = monthGridDays(date, 1, false);

    expect(days.every((day) => day.getMonth() === 8)).toBe(true);
    expect(days.length).toBe(30);
  });
});

describe("gridDaysForView", () => {
  it("returns one Date per day for a week view", () => {
    const date = new Date("2026-09-09T12:00:00Z");
    const days = gridDaysForView(date, "week", 1);

    expect(days).toHaveLength(7);
    expect(days[0].getDay()).toBe(1);
    expect(days[6].getDay()).toBe(0);
  });

  it("returns 5 days for a work week view", () => {
    const date = new Date("2026-09-09T12:00:00Z");
    const days = gridDaysForView(date, "work_week", 1);

    expect(days).toHaveLength(5);
  });
});

describe("localization", () => {
  it("detects French from Home Assistant locale", () => {
    const lang = detectLanguage({ states: {}, locale: { language: "fr-FR" }, callService: async () => undefined });
    expect(lang).toBe("fr");
    expect(localize("today", lang)).toBe("Aujourd'hui");
  });
});
