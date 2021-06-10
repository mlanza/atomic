export * from "./promise/construct.js";
export * from "./promise/concrete.js";
import Promise from "promise";
import {behaveAsPromise} from "./promise/behave.js";
behaveAsPromise(Promise);