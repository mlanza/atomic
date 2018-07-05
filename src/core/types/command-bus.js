export * from "./command-bus/construct";
export * from "./command-bus/concrete";
import CommandBus from "./command-bus/construct";
export default CommandBus;
import behave from "./command-bus/behave";
behave(CommandBus);