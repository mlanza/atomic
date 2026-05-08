export * from "./boolean/construct.js";
export * from "./boolean/concrete.js";
import behave from "./boolean/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Boolean: behave});
behave(Boolean);
