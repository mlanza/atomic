export * from "./promise/construct.js";
export * from "./promise/concrete.js";
import behave from "./promise/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Promise: behave});
behave(Promise);
