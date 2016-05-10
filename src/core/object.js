import {reduced, Reduced} from "./reduced.js";
import {empty as EMPTY} from "./empty.js";
import * as array from "./array.js";
import {cons} from "./cons.js";

export var assign = Object.assign; //TODO polyfill
export var keys   = Object.keys;

export function empty(){
  return {};
}

export function isEmpty(self){
  return keys(self).length === 0;
}

export function is(value, constructor) {
  return value != null && value.constructor === constructor;
}

export function append(self, obj){
  return assign({}, self, obj);
}

export function prepend(self, obj){
  return assign({}, obj, self);
}

export function each(self, f){
  var ks = keys(self), l = ks.length, i = 0, result = null;
  while(i < l && !(result instanceof Reduced)){
    var key = ks[i++];
    result = f([key, self[key]]);
  }
}

export function reduce(self, f, init) {
  var ks = keys(self), l = ks.length, i = 0, memo = init;
  while(i < l && !(result instanceof Reduced)){
    var key = ks[i++];
    memo = f(memo, [key, self[key]]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function constructs(value) {
  return value.constructor;
}

export function isSome(value){
  return value != null;
}

export function isNil(value){
  return value == null;
}

export function assoc(obj, key, value){
  var add = {};
  add[key] = value;
  return assign({}, obj, add);
}

export function hasKey(obj, key){
  return obj.hasOwnProperty(key);
}

export function first(obj){
  return isEmpty(obj) ? null : seq(obj).head;
}

export function rest(obj){
  return isEmpty(obj) ? EMPTY : seq(obj).tail();
}

export function seqFrom(obj, ks){
  var key = ks[0], value = obj[key];
  return ks.length ? cons([key, value], function(){
    return seqFrom(obj, array.rest(ks));
  }) : EMPTY;
}

export function seq(obj){
  return seqFrom(obj, keys(obj));
}
