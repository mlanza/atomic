export * from "./string/construct.js";
export * from "./string/concrete.js";
import behave from "./string/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {String: behave});
behave(String);
