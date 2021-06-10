export * from "./issue/construct.js";
import {Issue} from "./issue/construct.js";
import {behaveAsIssue} from "./issue/behave.js";
behaveAsIssue(Issue);