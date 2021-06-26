export * from "./reduced/construct.js";
export * from "./reduced/concrete.js";
import {Reduced} from "./reduced/construct.js";
import behave from "./reduced/behave.js";
behave(Reduced);
