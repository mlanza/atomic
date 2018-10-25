export * from "./period/construct";
export * from "./period/concrete";
import Period from "./period/construct";
import behave from "./period/behave";
export default Period;
behave(Period);