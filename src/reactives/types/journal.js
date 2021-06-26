export * from "./journal/construct.js";
import {Journal} from "./journal/construct.js";
import {behaveAsJournal} from "./journal/behave.js";
behaveAsJournal(Journal);