export * from "./weak-map/construct.js";
import WeakMap from "weak-map";
import {behaveAsWeakMap} from "./weak-map/behave.js";
behaveAsWeakMap(WeakMap);