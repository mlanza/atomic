export * from "./event-middleware/construct.js";
import {EventMiddleware} from "./event-middleware/construct.js";
import behave from "./event-middleware/behave.js";
behave(EventMiddleware);
