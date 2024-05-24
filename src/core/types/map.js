export * from "./map/construct.js";
import behave from "./map/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {Map: behave});
behave(Map);
