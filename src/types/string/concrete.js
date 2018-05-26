import {overload, constantly, unbind} from "../../core";
import {reducing} from "../reduced";
import {reducekv} from "../../protocols";
import String, {EMPTY_STRING} from "./construct";

export function isBlank(str){
  return str == null || typeof str === "string" && str.trim().length === 0;
}

function str1(x){
  return x == null ? "" : x.toString();
}

function str2(x, y){
  return str1(x) + str1(y);
}

export function template(template, obj){
  return reducekv(function(text, key, value){
    return replace(text, new RegExp("\\{" + key + "\\}", 'ig'), value);
  }, template, obj);
}

export function inject(template, ...args){
  return template(template, args);
}

export const startsWith = unbind(String.prototype.startsWith);
export const endsWith   = unbind(String.prototype.endsWith);
export const replace    = unbind(String.prototype.replace);
export const subs       = unbind(String.prototype.substring);
export const lowerCase  = unbind(String.prototype.toLowerCase);
export const upperCase  = unbind(String.prototype.toUpperCase);
export const trim       = unbind(String.prototype.trim);
export const str        = overload(constantly(EMPTY_STRING), str1, str2, reducing(str2));