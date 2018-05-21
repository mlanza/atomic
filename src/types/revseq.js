export * from "./revseq/construct";
import RevSeq from "./revseq/construct";
export default RevSeq;
import behave from "./revseq/behave";
behave(RevSeq);