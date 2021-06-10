export * from "./transient-array/construct.js";
import {TransientArray} from "./transient-array/construct.js";
import {behaveAsTransientArray} from "./transient-array/behave.js";
behaveAsTransientArray(TransientArray);