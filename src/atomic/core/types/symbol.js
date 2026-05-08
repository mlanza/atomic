import behave from "./symbol/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Symbol: behave});
behave(Symbol);
