import {overload, unbind} from "../../core";
import {reducing} from "../../protocols/ireduce/concrete";
import {IKVReduce, ITemplate} from "../../protocols";
import String, {emptyString} from "./construct";
import {_ as v} from "param.macro";

export function isBlank(str){
  return str == null || typeof str === "string" && str.trim().length === 0;
}

function str1(x){
  return x == null ? "" : x.toString();
}

function str2(x, y){
  return str1(x) + str1(y);
}

export function template(template, ...args){
  return ITemplate.fill(args, template);
}

export function camelToDashed(str){
  return str.replace(/[A-Z]/, function(x) { return "-" + x.toLowerCase() })
}

function split1(str){
  return str.split("");
}

function split3(str, pattern, n){
  var parts = [];
  while(str && n !== 0){
    var found = str.match(pattern);
    if (!found || n < 2) {
      parts.push(str);
      break;
    }
    var pos  = str.indexOf(found),
        part = str.substring(0, pos);
    parts.push(part);
    str = str.substring(pos + found.length);
    n = n ? n - 1 : n;
  }
  return parts;
}

export const split      = overload(split1, unbind(String.prototype.split), split3)
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
export const str        = overload(emptyString, str1, str2, reducing(str2));
export const zeros      = lpad(v, v, "0");