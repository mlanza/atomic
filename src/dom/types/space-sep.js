export * from "./space-sep/construct";
//export * from "./space-sep/concrete";
import SpaceSeparated from "./space-sep/construct";
import behave from "./space-sep/behave";
export default SpaceSeparated;
behave(SpaceSeparated);