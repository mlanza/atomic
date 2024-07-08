import behave from "./weak-set/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {WeakSet: behave});
behave(WeakSet);
