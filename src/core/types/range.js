export * from "./range/construct";
//export * from "./range/concrete";
import {Range} from "./range/construct";
import {behaveAsRange} from "./range/behave";
behaveAsRange(Range);