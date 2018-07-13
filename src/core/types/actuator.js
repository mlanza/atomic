export * from "./actuator/construct";
export * from "./actuator/concrete";
import Actuator from "./actuator/construct";
export default Actuator;
import behave from "./actuator/behave";
behave(Actuator);