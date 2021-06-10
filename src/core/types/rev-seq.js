export * from "./rev-seq/construct.js";
import {RevSeq} from "./rev-seq/construct.js";
import {behaveAsRevSeq} from "./rev-seq/behave.js";
behaveAsRevSeq(RevSeq);