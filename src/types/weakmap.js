export * from "./weakmap/construct";
export default WeakMap;
import WeakMap from "./weakmap/construct";
import behave from "./weakmap/behave";
behave(WeakMap);