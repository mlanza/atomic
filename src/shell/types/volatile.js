export * from "./volatile/construct.js";
export * from "./volatile/concrete.js";
import {Volatile} from "./volatile/construct.js";
import behave from "./volatile/behave.js";
behave(Volatile);
