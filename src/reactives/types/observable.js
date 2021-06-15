export * from "./observable/construct.js";
export * from "./observable/concrete.js";
import {Observable} from "./observable/construct.js";
import {behaveAsObservable} from "./observable/behave.js";
behaveAsObservable(Observable);