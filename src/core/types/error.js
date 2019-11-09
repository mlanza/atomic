export * from "./error/construct";
import {Error} from "./error/construct";
import {behaveAsError} from "./error/behave";
behaveAsError(Error);