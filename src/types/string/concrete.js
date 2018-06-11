import {overload, constantly, unbind} from "../../core";
import {reducing} from "../reduced";
import {IKVReduce} from "../../protocols";
import String from "./construct";

export function isBlank(str){
  return str == null || typeof str === "string" && str.trim().length === 0;
}

function str1(x){
  return x == null ? "" : x.toString();
}

function str2(x, y){
  return str1(x) + str1(y);
}

export function template(template, obj){ //pass in object or array
  return IKVReduce.reducekv(function(text, key, value){
    return replace(text, new RegExp("\\{" + key + "\\}", 'ig'), value);
  }, template, obj);
}

export function camelToDashed(str){
  return str.replace(/[A-Z]/, function(x) { return "-" + x.toLowerCase() })
}

export const split      = unbind(String.prototype.split);
export const startsWith = unbind(String.prototype.startsWith);
export const endsWith   = unbind(String.prototype.endsWith);
export const replace    = unbind(String.prototype.replace);
export const subs       = unbind(String.prototype.substring);
export const lowerCase  = unbind(String.prototype.toLowerCase);
export const upperCase  = unbind(String.prototype.toUpperCase);
export const lpad       = unbind(String.prototype.padStart);
export const rpad       = unbind(String.prototype.padEnd);
export const trim       = unbind(String.prototype.trim);
export const rtrim      = unbind(String.prototype.trimRight);
export const ltrim      = unbind(String.prototype.trimLeft);
export const str        = overload(constantly(String.EMPTY), str1, str2, reducing(str2));