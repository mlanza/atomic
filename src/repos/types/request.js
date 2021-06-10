export * from "./request/construct.js";
export * from "./request/concrete.js";
import {Request} from "./request/construct.js";
import {behaveAsRequest} from "./request/behave.js";
behaveAsRequest(Request);