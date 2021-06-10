export * from "./card/construct.js";
import {Cardinality} from "./card/construct.js";
import {behaveAsCardinality} from "./card/behave.js";
behaveAsCardinality(Cardinality);