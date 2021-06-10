export * from "./recurrence/construct.js";
import {Recurrence} from "./recurrence/construct.js";
import {behaveAsRecurrence} from "./recurrence/behave.js";
behaveAsRecurrence(Recurrence);