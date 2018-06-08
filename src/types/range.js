export * from "./range/construct";
//export * from "./range/concrete";
import Range from "./range/construct";
import behave from "./range/behave";
export default Range;
export {Range};
behave(Range);