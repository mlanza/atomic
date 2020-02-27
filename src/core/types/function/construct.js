import {Symbol} from '../symbol/construct';

Function.prototype[Symbol.toStringTag] = "Function";

export function isFunction(self){
  return self && self.constructor === Function;
}