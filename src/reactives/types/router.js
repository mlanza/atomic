export * from "./router/construct";
export * from "./router/concrete";
import {Router} from "./router/construct";
import {behaveAsRouter} from "./router/behave";
behaveAsRouter(Router);