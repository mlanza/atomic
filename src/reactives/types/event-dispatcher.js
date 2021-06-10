export * from "./event-dispatcher/construct.js";
import {EventDispatcher} from "./event-dispatcher/construct.js";
import {behaveAsEventDispatcher} from "./event-dispatcher/behave.js";
behaveAsEventDispatcher(EventDispatcher);