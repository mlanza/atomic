export * from "./fluent/construct";
import {Fluent} from "./fluent/construct";
import {behaveAsFluent} from "./fluent/behave";
behaveAsFluent(Fluent);