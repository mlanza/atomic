export * from "./number/concrete.js";
import behave from "./number/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Number: behave});
behave(Number);
