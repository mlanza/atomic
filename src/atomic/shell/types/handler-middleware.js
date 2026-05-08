export * from "./handler-middleware/construct.js";
import {HandlerMiddleware} from "./handler-middleware/construct.js";
import behave from "./handler-middleware/behave.js";
behave(HandlerMiddleware);
