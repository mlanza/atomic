export * from "./issue/construct";
import {Issue} from "./issue/construct";
import {behaveAsIssue} from "./issue/behave";
behaveAsIssue(Issue);