export * from "./message-processor/construct.js";
import {MessageProcessor} from "./message-processor/construct.js";
import {behaveAsMessageProcessor} from "./message-processor/behave.js";
behaveAsMessageProcessor(MessageProcessor);