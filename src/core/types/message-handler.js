export * from "./message-handler/construct";
import MessageHandler from "./message-handler/construct";
export default MessageHandler;
import behave from "./message-handler/behave";
behave(MessageHandler);