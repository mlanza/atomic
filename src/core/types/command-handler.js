export * from "./command-handler/construct";
import CommandHandler from "./command-handler/construct";
export default CommandHandler;
import behave from "./command-handler/behave";
behave(CommandHandler);