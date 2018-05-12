export * from "./indexedseq/construct";
import IndexedSeq from "./indexedseq/construct";
export default IndexedSeq;
import behave from "./indexedseq/impl";
behave(IndexedSeq);