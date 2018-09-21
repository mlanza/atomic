export * from "./observable/construct";
export * from "./observable/concrete";
import Observable from "./observable/construct";
export default Observable;
import behave from "./observable/behave";
behave(Observable);
