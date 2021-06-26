export * from "./middleware/construct.js";
export * from "./middleware/concrete.js";
import {Middleware} from "./middleware/construct.js";
import behave from "./middleware/behave.js";
behave(Middleware);