export * from "./reg-exp/construct";
export * from "./reg-exp/concrete";
import RegExp from "./reg-exp/construct";
import behave from "./reg-exp/behave";
export default RegExp;
export {RegExp};
behave(RegExp);