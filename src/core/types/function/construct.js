import {Symbol} from '../symbol/construct';

export {Function};

Function.prototype[Symbol.toStringTag] = "Function";

export function isFunction(self){
  return self && self.constructor === Function;
}