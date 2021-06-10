export * from "./bus/construct.js";
import {Bus} from "./bus/construct.js";
import {behaveAsBus} from "./bus/behave.js";
behaveAsBus(Bus);