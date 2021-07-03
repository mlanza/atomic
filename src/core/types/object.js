export * from "./object/construct.js";
export * from "./object/concrete.js";
import behave from "./object/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Object: behave});
behave(Object);
