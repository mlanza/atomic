export * from "./fluent/construct.js";
import {Fluent} from "./fluent/construct.js";
import {behaveAsFluent} from "./fluent/behave.js";
behaveAsFluent(Fluent);