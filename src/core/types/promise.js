export * from "./promise/construct";
//export * from "./promise/concrete";
import Promise from "./promise/construct";
import behave from "./promise/behave";
export default Promise;
behave(Promise);