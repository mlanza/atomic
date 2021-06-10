export * from "./transient-object/construct.js";
import {TransientObject} from "./transient-object/construct.js";
import {behaveAsTransientObject} from "./transient-object/behave.js";
behaveAsTransientObject(TransientObject);