export * from "./router/construct";
export * from "./router/concrete";
import Router from "./router/construct";
export default Router;
import behave from "./router/behave";
behave(Router);