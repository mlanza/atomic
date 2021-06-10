export * from "./set/construct.js";
export * from "./set/concrete.js";
import {Set} from "immutable";
import {behaveAsSet} from "./set/behave.js";
behaveAsSet(Set);