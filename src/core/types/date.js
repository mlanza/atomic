export * from "./date/construct";
export * from "./date/concrete";
import {Date} from "./date/construct";
import {behaveAsDate} from "./date/behave";
behaveAsDate(Date);