export * from "./promise/construct";
export * from "./promise/concrete";
import Promise from "promise";
import {behaveAsPromise} from "./promise/behave";
behaveAsPromise(Promise);