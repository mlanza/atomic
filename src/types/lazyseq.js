export * from "./lazyseq/construct";
import LazySeq from "./lazyseq/construct";
export default LazySeq;
import behave from "./lazyseq/impl";
behave(LazySeq);