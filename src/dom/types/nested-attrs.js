export * from "./nested-attrs/construct";
//export * from "./nested-attrs/concrete";
import {NestedAttrs} from "./nested-attrs/construct";
import {behaveAsNestedAttrs} from "./nested-attrs/behave";
behaveAsNestedAttrs(NestedAttrs);