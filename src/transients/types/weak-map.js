export * from "./weak-map/construct.js";
import behave from "./weak-map/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {WeakMap: behave});
behave(WeakMap);
