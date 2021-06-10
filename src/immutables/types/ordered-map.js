export * from "./ordered-map/construct.js";
import {OrderedMap} from "./ordered-map/construct.js";
import {behaveAsOrderedMap} from "./ordered-map/behave.js";
behaveAsOrderedMap(OrderedMap);