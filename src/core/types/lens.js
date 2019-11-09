export * from "./lens/construct";
//export * from "./lens/concrete";
import {Lens} from "./lens/construct";
import {behaveAsLens} from "./lens/behave";
behaveAsLens(Lens);