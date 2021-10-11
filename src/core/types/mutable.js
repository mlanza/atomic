export * from "./mutable/construct.js";
export * from "./mutable/concrete.js";
import {Mutable} from "./mutable/construct.js";
import behave from "./mutable/behave.js";
behave(Mutable);
