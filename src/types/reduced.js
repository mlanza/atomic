export * from "./reduced/construct";
export * from "./reduced/concrete";
import Reduced from "./reduced/construct";
export default Reduced;
import behave from "./reduced/behave";
behave(Reduced);
