export * from "./transient-set/construct.js";
import {TransientSet} from "./transient-set/construct.js";
import {behaveAsTransientSet} from "./transient-set/behave.js";
behaveAsTransientSet(TransientSet);