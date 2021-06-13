export * from "./observable/construct.js";
import {Observable} from "./observable/construct.js";
import {behaveAsObservable} from "./observable/behave.js";
behaveAsObservable(Observable);