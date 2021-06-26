export * from "./request/construct.js";
export * from "./request/concrete.js";
import {Request} from "./request/construct.js";
import behave from "./request/behave.js";
behave(Request);