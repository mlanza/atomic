export * from "./maybe/construct.js";
import {Maybe} from "./maybe/construct.js";
import {behaveAsMaybe} from "./maybe/behave.js";
behaveAsMaybe(Maybe);