export * from "./lazyseq/construct";
export * from "./lazyseq/concrete";
import LazySeq from "./lazyseq/construct";
export default LazySeq;
import behave from "./lazyseq/behave";
behave(LazySeq);