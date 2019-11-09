export * from "./number/construct";
export * from "./number/concrete";
import {Number} from "./number/construct";
import {behaveAsNumber} from "./number/behave";
behaveAsNumber(Number);