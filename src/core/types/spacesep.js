export * from "./spacesep/construct";
//export * from "./spacesep/concrete";
import SpaceSeparated from "./spacesep/construct";
import behave from "./spacesep/behave";
export default SpaceSeparated;
behave(SpaceSeparated);