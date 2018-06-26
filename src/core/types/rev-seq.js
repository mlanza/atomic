export * from "./rev-seq/construct";
import RevSeq from "./rev-seq/construct";
export default RevSeq;
import behave from "./rev-seq/behave";
behave(RevSeq);