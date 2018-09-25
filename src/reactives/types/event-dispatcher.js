export * from "./event-dispatcher/construct";
import EventDispatcher from "./event-dispatcher/construct";
export default EventDispatcher;
import behave from "./event-dispatcher/behave";
behave(EventDispatcher);
