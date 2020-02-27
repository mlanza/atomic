export * from "./request/construct";
import {Request} from "./request/construct";
import {behaveAsRequest} from "./request/behave";
behaveAsRequest(Request);