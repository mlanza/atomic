export * from "./indexed-seq/construct.js";
import {IndexedSeq} from "./indexed-seq/construct.js";
import {behaveAsIndexedSeq} from "./indexed-seq/behave.js";
behaveAsIndexedSeq(IndexedSeq);