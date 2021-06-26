export * from "./benchmark/construct.js";
import {Benchmark} from "./benchmark/construct.js";
export * from "./benchmark/concrete.js";
import behave from "./benchmark/behave.js";
behave(Benchmark);