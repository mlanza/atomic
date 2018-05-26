export * from "./number/construct";
export * from "./number/concrete";
import Number from "./number/construct";
export default Number;
import behave from "./number/behave";
behave(Number);
