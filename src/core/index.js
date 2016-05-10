import {Reduced} from "./reduced.js";
import {keys} from './object.js';
export {first, rest} from './array.js';

export function empty(){
  return {};
}

export function isEmpty(index){
  return !index.length;
}

export function each(self, f){
  var ks = keys(self), l = ks.length, i = 0, result = null;
  while(i < l && !(result instanceof Reduced)){
    var key = ks[i++];
    result = f(self[key]);
  }
}

export function reduce(self, f, init) {
  var ks = keys(self), len = ks.length, i = 0, memo = init;
  while(i < len && !(memo instanceof Reduced)){
    var key = ks[i++];
    memo = f(memo, self[key]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}
