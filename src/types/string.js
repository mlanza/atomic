import {overload, constantly, unbind} from "../core";
export * from "./string/construct";
import String, {EMPTY_STRING} from "./string/construct";
export default String;
import behave from "./string/behave";
import {reducing} from "./function";

behave(String);

export function isString(s){
  return typeof s === "string";
}

export function isBlank(str){
  return str == null || typeof str === "string" && str.trim().length === 0;
}

function str1(x){
  return x == null ? "" : x.toString();
}

function str2(x, y){
  return str1(x) + str1(y);
}

export const str       = overload(constantly(EMPTY_STRING), str1, str2, reducing(str2));
export const lowerCase = unbind(String.prototype.toLowerCase);
export const upperCase = unbind(String.prototype.toUpperCase);
export const trim      = unbind(String.prototype.trim);