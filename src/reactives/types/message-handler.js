export * from "./message-handler/construct";
import {MessageHandler} from "./message-handler/construct";
import {behaveAsMessageHandler} from "./message-handler/behave";
behaveAsMessageHandler(MessageHandler);