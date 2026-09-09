import { describe, expect, it } from "vitest";
import { dateRangeForView, normalizeConfig } from "../src/config";
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

describe("localization", () => {
  it("detects French from Home Assistant locale", () => {
    const lang = detectLanguage({ states: {}, locale: { language: "fr-FR" }, callService: async () => undefined });
    expect(lang).toBe("fr");
    expect(localize("today", lang)).toBe("Aujourd'hui");
  });
});
