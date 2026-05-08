export * from "./ordered-set/construct.js";
import {OrderedSet} from "./ordered-set/construct.js";
import behave from "./set/behave.js";
behave(OrderedSet);