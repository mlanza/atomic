export * from "./command-bus/construct";
import CommandBus from "./command-bus/construct";
export default CommandBus;
import behave from "./command-bus/behave";
behave(CommandBus);