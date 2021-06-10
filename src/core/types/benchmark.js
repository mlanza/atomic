export * from "./benchmark/construct.js";
import {Benchmark} from "./benchmark/construct.js";
export * from "./benchmark/concrete.js";
import {behaveAsBenchmark} from "./benchmark/behave.js";
behaveAsBenchmark(Benchmark);