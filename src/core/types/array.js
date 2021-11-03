export * from "./array/construct.js";
export * from "./array/concrete.js";
import behave from "./array/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Array: behave});
behave(Array);
