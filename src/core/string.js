import {unbind} from "./core.js";
import {reduced, Reduced} from "./reduced.js";

export const toUpperCase = unbind(String.prototype.toUpperCase);
export const toLowerCase = unbind(String.prototype.toLowerCase);

export function empty(){
  return "";
}

export function isEmpty(str){
  return str === "";
}

export function append(str, suffix){
  return str + suffix;
}

export function prepend(str, prefix){
  return prefix + str;
}

export function each(str, f){
  var len = str.length, i = 0, result = null;
  while(i < len && !(result instanceof Reduced)){
    result = f(str[i++]);
  }
  return str;
}

export function reduce(str, f, init) {
  var len = str.length, i = 0, memo = init;
  while(i < len && !(memo instanceof Reduced)){
    memo = f(memo, str[i++]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function assoc(str, idx, ch){
  return slice(str).splice(idx, 1, ch).join("");
}

export function hasKey(str, idx){
  return idx > -1 && idx < str.length;
}
