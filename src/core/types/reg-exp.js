export * from "./reg-exp/construct";
export * from "./reg-exp/concrete";
import {RegExp} from "./reg-exp/construct";
import {behaveAsRegExp} from "./reg-exp/behave";
behaveAsRegExp(RegExp);