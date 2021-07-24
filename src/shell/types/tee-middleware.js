export * from "./tee-middleware/construct.js";
import {TeeMiddleware} from "./tee-middleware/construct.js";
import behave from "./tee-middleware/behave.js";
behave(TeeMiddleware);
