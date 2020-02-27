export * from "./indexed-seq/construct";
import {IndexedSeq} from "./indexed-seq/construct";
import {behaveAsIndexedSeq} from "./indexed-seq/behave";
behaveAsIndexedSeq(IndexedSeq);