export * from "./indexed-seq/construct";
import IndexedSeq from "./indexed-seq/construct";
export default IndexedSeq;
import behave from "./indexed-seq/behave";
behave(IndexedSeq);