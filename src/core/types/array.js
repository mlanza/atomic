export * from "./array/construct.js";
import behave from "./array/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Array: behave});
export const iarray = behave;
behave(Array);
