export * from "./lazy-seq/construct";
export * from "./lazy-seq/concrete";
import {LazySeq} from "./lazy-seq/construct";
import {behaveAsLazySeq} from "./lazy-seq/behave";
behaveAsLazySeq(LazySeq);