export * from "./date/construct";
export * from "./date/concrete";
export default Date;
import Date from "./date/construct";
import behave from "./date/behave";
behave(Date);