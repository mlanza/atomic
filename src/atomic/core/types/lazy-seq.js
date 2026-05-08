export * from "./lazy-seq/construct.js";
export * from "./lazy-seq/concrete.js";
import {LazySeq} from "./lazy-seq/construct.js";
import behave from "./lazy-seq/behave.js";
behave(LazySeq);