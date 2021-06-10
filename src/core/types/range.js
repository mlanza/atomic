export * from "./range/construct.js";
//export * from "./range/concrete.js";
import {Range} from "./range/construct.js";
import {behaveAsRange} from "./range/behave.js";
behaveAsRange(Range);