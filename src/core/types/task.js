export * from "./task/construct.js";
import {Task} from "./task/construct.js";
import {behaveAsTask} from "./task/behave.js";
behaveAsTask(Task);