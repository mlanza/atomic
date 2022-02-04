import behave from "./node-list/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {HTMLCollection: behave});
behave(HTMLCollection);
