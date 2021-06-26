export * from "./observable/construct.js";
export * from "./observable/concrete.js";
import {Observable} from "./observable/construct.js";
import behave from "./observable/behave.js";
behave(Observable);