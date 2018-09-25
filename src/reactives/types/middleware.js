export * from "./middleware/construct";
export * from "./middleware/concrete";
import Middleware from "./middleware/construct";
export default Middleware;
export {Middleware};
import behave from "./middleware/behave";
behave(Middleware);