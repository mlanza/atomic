export * from "./middleware/construct.js";
export * from "./middleware/concrete.js";
import {Middleware} from "./middleware/construct.js";
import {behaveAsMiddleware} from "./middleware/behave.js";
behaveAsMiddleware(Middleware);