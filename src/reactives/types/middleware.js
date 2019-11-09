export * from "./middleware/construct";
export * from "./middleware/concrete";
import {Middleware} from "./middleware/construct";
import {behaveAsMiddleware} from "./middleware/behave";
behaveAsMiddleware(Middleware);