export * from "./space-sep/construct";
//export * from "./space-sep/concrete";
import {SpaceSeparated} from "./space-sep/construct";
import {behaveAsSpaceSeparated} from "./space-sep/behave";
behaveAsSpaceSeparated(SpaceSeparated);