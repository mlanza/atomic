export * from "./drain-events-middleware/construct.js";
import {DrainEventsMiddleware} from "./drain-events-middleware/construct.js";
import behave from "./drain-events-middleware/behave.js";
behave(DrainEventsMiddleware);
