export * from "./events/construct";
import {Events} from "./events/construct";
import {behaveAsEvents} from "./events/behave";
behaveAsEvents(Events);