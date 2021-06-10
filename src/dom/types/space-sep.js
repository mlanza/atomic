export * from "./space-sep/construct.js";
//export * from "./space-sep/concrete.js";
import {SpaceSeparated} from "./space-sep/construct.js";
import {behaveAsSpaceSeparated} from "./space-sep/behave.js";
behaveAsSpaceSeparated(SpaceSeparated);