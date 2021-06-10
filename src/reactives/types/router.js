export * from "./router/construct.js";
export * from "./router/concrete.js";
import {Router} from "./router/construct.js";
import {behaveAsRouter} from "./router/behave.js";
behaveAsRouter(Router);