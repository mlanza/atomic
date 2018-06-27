export * from "./actuator/construct";
import Actuator from "./actuator/construct";
export default Actuator;
import behave from "./actuator/behave";
behave(Actuator);