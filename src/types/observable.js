export * from "./observable/construct";
import Observable from "./observable/construct";
export default Observable;
import behave from "./observable/impl";
behave(Observable);