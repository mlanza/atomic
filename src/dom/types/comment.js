import behave from "./comment/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Comment: behave});
behave(Comment);
