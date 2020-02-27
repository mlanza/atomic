export * from "./transient-object/construct";
import {TransientObject} from "./transient-object/construct";
import {behaveAsTransientObject} from "./transient-object/behave";
behaveAsTransientObject(TransientObject);