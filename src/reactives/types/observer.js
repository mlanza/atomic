export * from "./observer/construct.js";
import {Observer} from "./observer/construct.js";
import {behaveAsObserver} from "./observer/behave.js";
behaveAsObserver(Observer);