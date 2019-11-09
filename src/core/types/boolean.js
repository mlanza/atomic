export * from "./boolean/construct";
export * from "./boolean/concrete";
import {Boolean} from "./boolean/construct";
import {behaveAsBoolean} from "./boolean/behave";
behaveAsBoolean(Boolean);