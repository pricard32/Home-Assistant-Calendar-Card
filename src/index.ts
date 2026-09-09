import "./family-hub-calendar-card";
import "./family-hub-calendar-editor";

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "family-hub-calendar",
  name: "Family Hub Calendar",
  description: "Premium family planner card with calendar, tasks, meals, and weather"
});
