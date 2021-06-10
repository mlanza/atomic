export * from "./predicate/construct.js";
import {Predicate} from "./predicate/construct.js";
import {behaveAsPredicate} from "./predicate/behave.js";
behaveAsPredicate(Predicate);