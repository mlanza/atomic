import {unbind} from "../core";
export * from "./string/construct";
import String from "./string/construct";
export default String;
import behave from "./string/behave";
behave(String);

export function isString(s){
  return typeof s === "string";
}

export function isBlank(str){
  return str == null || typeof str === "string" && str.trim().length === 0;
}

export const lowerCase = unbind(String.prototype.toLowerCase);
export const upperCase = unbind(String.prototype.toUpperCase);
export const trim      = unbind(String.prototype.trim);