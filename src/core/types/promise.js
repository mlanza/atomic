export * from "./promise/construct";
export * from "./promise/concrete";
import {Promise} from "./promise/construct";
import {behaveAsPromise} from "./promise/behave";
behaveAsPromise(Promise);