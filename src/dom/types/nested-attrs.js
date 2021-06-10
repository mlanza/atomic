export * from "./nested-attrs/construct.js";
//export * from "./nested-attrs/concrete.js";
import {NestedAttrs} from "./nested-attrs/construct.js";
import {behaveAsNestedAttrs} from "./nested-attrs/behave.js";
behaveAsNestedAttrs(NestedAttrs);