import {reduced, Reduced} from "./reduced.js";

export var assign = Object.assign; //TODO polyfill
export var keys   = Object.keys;

export function empty(){
  return {};
}

export function isEmpty(self){
  return keys(self).length === 0;
}

export function identity(value){
  return value;
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
