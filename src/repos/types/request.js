export * from "./request/construct";
export * from "./request/concrete";
import {Request} from "./request/construct";
import {behaveAsRequest} from "./request/behave";
behaveAsRequest(Request);