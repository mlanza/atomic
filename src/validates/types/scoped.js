export * from "./scoped/construct.js";
import {Scoped} from "./scoped/construct.js";
import {behaveAsScoped} from "./scoped/behave.js";
behaveAsScoped(Scoped);