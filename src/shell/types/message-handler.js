export * from "./message-handler/construct.js";
import {MessageHandler} from "./message-handler/construct.js";
import behave from "./message-handler/behave.js";
behave(MessageHandler);