export * from "./readonly/construct";
import Readonly from "./readonly/construct";
export default Readonly;
import behave from "./readonly/behave";
behave(Readonly);