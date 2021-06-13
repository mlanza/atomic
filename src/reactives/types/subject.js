export * from "./subject/construct.js";
import {Subject} from "./subject/construct.js";
import {behaveAsSubject} from "./subject/behave.js";
behaveAsSubject(Subject);
