export * from "./date/construct.js";
export * from "./date/concrete.js";
import behave from "./date/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Date: behave});
behave(Date);
