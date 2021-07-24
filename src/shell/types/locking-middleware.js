export * from "./locking-middleware/construct.js";
import {LockingMiddleware} from "./locking-middleware/construct.js";
import behave from "./locking-middleware/behave.js";
behave(LockingMiddleware);
