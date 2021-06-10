export * from "./concatenated/construct.js";
import {Concatenated} from "./concatenated/construct.js";
import {behaveAsConcatenated} from "./concatenated/behave.js";
behaveAsConcatenated(Concatenated);