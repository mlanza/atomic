export * from "./lazy-seq/construct";
export * from "./lazy-seq/concrete";
import LazySeq from "./lazy-seq/construct";
export default LazySeq;
import behave from "./lazy-seq/behave";
behave(LazySeq);