export * from "./message-handler/construct.js";
import {MessageHandler} from "./message-handler/construct.js";
import {behaveAsMessageHandler} from "./message-handler/behave.js";
behaveAsMessageHandler(MessageHandler);