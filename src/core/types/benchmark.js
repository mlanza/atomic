export * from "./benchmark/construct";
import {Benchmark} from "./benchmark/construct";
export * from "./benchmark/concrete";
import {behaveAsBenchmark} from "./benchmark/behave";
behaveAsBenchmark(Benchmark);