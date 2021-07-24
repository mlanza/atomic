export * from "./message-bus/construct.js";
import {MessageBus} from "./message-bus/construct.js";
import behave from "./message-bus/behave.js";
behave(MessageBus);
