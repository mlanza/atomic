export * from "./router/construct.js";
export * from "./router/concrete.js";
import {Router} from "./router/construct.js";
import behave from "./router/behave.js";
behave(Router);