export * from "./period/construct";
export * from "./period/concrete";
import {Period} from "./period/construct";
import {behaveAsPeriod} from "./period/behave";
behaveAsPeriod(Period);