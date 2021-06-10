export * from "./associative-subset/construct.js";
import {AssociativeSubset} from "./associative-subset/construct.js";
import {behaveAsAssociativeSubset} from "./associative-subset/behave.js";
behaveAsAssociativeSubset(AssociativeSubset);