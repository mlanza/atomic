export * from "./message-processor/construct";
import MessageProcessor from "./message-processor/construct";
export default MessageProcessor;
import behave from "./message-processor/behave";
behave(MessageProcessor);