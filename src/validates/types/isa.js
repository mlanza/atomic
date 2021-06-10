export * from "./isa/construct.js";
import {Isa} from "./isa/construct.js";
import {behaveAsIsa} from "./isa/behave.js";
behaveAsIsa(Isa);