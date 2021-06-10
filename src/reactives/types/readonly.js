export * from "./readonly/construct.js";
import {Readonly} from "./readonly/construct.js";
import {behaveAsReadonly} from "./readonly/behave.js";
behaveAsReadonly(Readonly);