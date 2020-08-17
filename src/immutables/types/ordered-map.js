export * from "./ordered-map/construct";
import {OrderedMap} from "./ordered-map/construct";
import {behaveAsOrderedMap} from "./ordered-map/behave";
behaveAsOrderedMap(OrderedMap);