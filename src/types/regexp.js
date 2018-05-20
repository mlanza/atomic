import {unbind} from "../core";
export * from "./regexp/construct";
import RegExp from "./regexp/construct";

export function isRegExp(self){
  return self.constructor === RegExp;
}

export const test = unbind(RegExp.prototype.test);