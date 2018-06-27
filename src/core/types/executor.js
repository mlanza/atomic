export * from "./executor/construct";
import Executor from "./executor/construct";
export default Executor;
import behave from "./executor/behave";
behave(Executor);