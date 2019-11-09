export * from "./message-processor/construct";
import {MessageProcessor} from "./message-processor/construct";
import {behaveAsMessageProcessor} from "./message-processor/behave";
behaveAsMessageProcessor(MessageProcessor);