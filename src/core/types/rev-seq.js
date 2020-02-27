export * from "./rev-seq/construct";
import {RevSeq} from "./rev-seq/construct";
import {behaveAsRevSeq} from "./rev-seq/behave";
behaveAsRevSeq(RevSeq);