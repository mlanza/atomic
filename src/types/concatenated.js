export * from "./concatenated/construct";
import Concatenated from "./concatenated/construct";
export default Concatenated;
import behave from "./concatenated/impl";
behave(Concatenated);