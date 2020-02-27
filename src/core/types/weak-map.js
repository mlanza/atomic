export * from "./weak-map/construct";
import {WeakMap} from "./weak-map/construct";
import {behaveAsWeakMap} from "./weak-map/behave";
behaveAsWeakMap(WeakMap);