export * from "./pipeline/construct";
export * from "./pipeline/concrete";
import Pipeline from "./pipeline/construct";
export default Pipeline;
import behave from "./pipeline/behave";
behave(Pipeline);