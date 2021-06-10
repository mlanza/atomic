export * from "./ordered-set/construct.js";
import {OrderedSet} from "./ordered-set/construct.js";
import {behaveAsSet} from "./set/behave.js";
behaveAsSet(OrderedSet);