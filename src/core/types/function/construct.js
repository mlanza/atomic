import Symbol from 'symbol';

Function.prototype[Symbol.toStringTag] = "Function";

export function isFunction(self){
  return self && self.constructor === Function;
}