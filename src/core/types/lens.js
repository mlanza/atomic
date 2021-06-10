export * from "./lens/construct.js";
//export * from "./lens/concrete.js";
import {Lens} from "./lens/construct.js";
import {behaveAsLens} from "./lens/behave.js";
behaveAsLens(Lens);