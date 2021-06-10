export * from "./props/construct.js";
//export * from "./props/concrete.js";
import {Props} from "./props/construct.js";
import {behaveAsProps} from "./props/behave.js";
behaveAsProps(Props);