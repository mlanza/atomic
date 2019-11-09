export * from "./event-dispatcher/construct";
import {EventDispatcher} from "./event-dispatcher/construct";
import {behaveAsEventDispatcher} from "./event-dispatcher/behave";
behaveAsEventDispatcher(EventDispatcher);