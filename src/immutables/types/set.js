export * from "./set/construct";
export * from "./set/concrete";
import {Set} from "./set/construct";
import {behaveAsSet} from "./set/behave";
behaveAsSet(Set);