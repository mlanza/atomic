export * from "./set/construct.js";
export * from "./set/concrete.js";
import {Set} from "immutable";
import behave from "./set/behave.js";
behave(Set);