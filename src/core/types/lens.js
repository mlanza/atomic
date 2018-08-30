export * from "./lens/construct";
//export * from "./lens/concrete";
import Lens from "./lens/construct";
export default Lens;
import behave from "./lens/behave";
behave(Lens);