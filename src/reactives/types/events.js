export * from "./events/construct.js";
import {Events} from "./events/construct.js";
import {behaveAsEvents} from "./events/behave.js";
behaveAsEvents(Events);