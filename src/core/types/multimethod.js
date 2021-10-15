export * from "./multimethod/construct.js";
export * from "./multimethod/concrete.js";
import {Multimethod} from "./multimethod/construct.js";
import behave from "./multimethod/behave.js";
behave(Multimethod);
