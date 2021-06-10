export * from "./reduced/construct.js";
export * from "./reduced/concrete.js";
import {Reduced} from "./reduced/construct.js";
import {behaveAsReduced} from "./reduced/behave.js";
behaveAsReduced(Reduced);
