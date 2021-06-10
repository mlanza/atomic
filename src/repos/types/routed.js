export * from "./routed/construct.js";
import {Routed} from "./routed/construct.js";
import {behaveAsRouted} from "./routed/behave.js";
behaveAsRouted(Routed);