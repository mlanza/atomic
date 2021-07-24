export * from "./message-processor/construct.js";
import {MessageProcessor} from "./message-processor/construct.js";
import behave from "./message-processor/behave.js";
behave(MessageProcessor);