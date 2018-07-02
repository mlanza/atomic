export * from "./fluent/construct";
export default Fluent;
import Fluent from "./fluent/construct";
import behave from "./fluent/behave";
behave(Fluent);