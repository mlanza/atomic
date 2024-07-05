import behave from "./set/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Set: behave});
behave(Set);
