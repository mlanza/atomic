import {unbind} from "../core";
export * from "./regexp/construct";
import RegExp from "./regexp/construct";

export const test   = unbind(RegExp.prototype.test);