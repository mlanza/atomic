export * from "./benchmark/construct";
import Benchmark from "./benchmark/construct";
export * from "./benchmark/concrete";
export default Benchmark;
import behave from "./benchmark/behave";
behave(Benchmark);