export * from "./set/construct.js";
import behave from "./set/behave.js";
import {behaviors} from "../../transients/behaviors.js";
Object.assign(behaviors, {Set: behave});
behave(Set);
