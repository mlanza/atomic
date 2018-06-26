export * from "./weak-map/construct";
export default WeakMap;
import WeakMap from "./weak-map/construct";
import behave from "./weak-map/behave";
behave(WeakMap);