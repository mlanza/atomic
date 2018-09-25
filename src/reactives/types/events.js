export * from "./events/construct";
export default Events;
import Events from "./events/construct";
import behave from "./events/behave";
behave(Events);