import {Reduced} from './reduced.js';

export const unbind  = Function.call.bind(Function.bind, Function.call);
export const slice   = unbind(Array.prototype.slice);
export const splice  = unbind(Array.prototype.splice);
export const reverse = unbind(Array.prototype.reverse)
export const join    = unbind(Array.prototype.join);
export const concat  = unbind(Array.prototype.concat);

export function each(self, f){
  var len = self.length, i = 0, result = null;
  while(i < len && !(result instanceof Reduced)){
    result = f(self[i++]);
  }
}

export function reduce(self, f, init) {
  var len = self.length, i = 0, memo = init;
  while(i < len && !(memo instanceof Reduced)){
    memo = f(memo, self[i++]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function head(self, len){
  return len ? slice(self, 0, len) : self[0];
}

export function tail(self, idx){
  return slice(self, idx || 1);
}

export function last(self, len){
  return len ? slice(self, self.length - len) : self[self.length - 1];
}

export function isIdentical(a, b){
  return a === b;
}

export function identity(value){
  return value;
}

export function constructs(value) {
  return value.constructor;
}
