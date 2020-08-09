export * from "./ordered-set/construct";
import {OrderedSet} from "./ordered-set/construct";
import {behaveAsSet} from "./set/behave";
behaveAsSet(OrderedSet);