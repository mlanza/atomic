export * from "./set/construct";
export * from "./set/concrete";
import {Set} from "immutable";
import {behaveAsSet} from "./set/behave";
behaveAsSet(Set);