import unbind from './unbind';
import Reduced from './types/reduced';
import {deref} from './protocols/deref';

export const log = console.log.bind(console);
export const slice = unbind(Array.prototype.slice);
export const assign  = Object.assign;

export function reverse(xs){
  return slice(xs).reverse();
}

export function reduce(xs, xf, init){
  var memo = init, len = xs.length;
  for(var i = 0; i < len; i++){
    if (memo instanceof Reduced)
      break;
    memo = xf(memo, xs[i]);
  }
  return deref(memo);
}

export function identity(value){
  return value;
}

export function first(self){
  return self[0];
}

export function rest(self){
  return slice(self, 1);
}

export function initial(self){
  return slice(self, 0, self.length - 1);
}

export function partial(f){
  var applied = rest(arguments);
  return function(){
    return f.apply(this, concat(applied, arguments));
  }
}

export function curry(f, len, applied){
  return len ? function(){
    //every call to a curried function advances by at least one argument (see `undefined`).
    var args = (applied || []).concat(arguments.length === 0 ? [undefined] : slice(arguments));
    if (args.length >= len) {
      return f.apply(this, args);
    } else {
      return curry(f, len, args);
    }
  } : curry(f, f.length);
}

export function complement(f){
  return function(){
    return !f.apply(this, arguments);
  }
}

function arities(lkp, fallback){
  return assign(function(){
    var f = lkp[arguments.length] || fallback;
    return f.apply(this, arguments);
  }, lkp);
}

export function multiarity(){
  return arities(reduce(arguments, function(memo, f){
    memo[f.length] = f;
    return memo;
  }, {}));
}

export function overload(){
  return arities(arguments, arguments[arguments.length - 1]);
}

export function arity(len, f){
  return function(){
    return f.apply(this, slice(arguments, 0, len));
  }
};

export function append(self, value){
  return self.concat([value]);
}

export function flip(f, len){
  var l = len || f.length;
  return curry(arity(l, function(){
    var size = arguments.length,
        last = arguments[size - 1],
        rest = slice(arguments, 0, size - 1),
        args = [last].concat(rest);
    return f.apply(this, args);
  }), l);
}

export function chain(init){
  return reduce(rest(arguments), function(value, f){
    return f(value);
  }, init);
}

export function pipe(){
  var fs = slice(arguments);
  return function(init){
    return reduce(fs, function(value, f){
      return f(value);
    }, init);
  }
}

export function compose(){
  return pipe.apply(this, chain(arguments, slice, reverse));
}

export function multimethod(dispatch){
  return function(){
    var f = dispatch.apply(this, arguments);
    return f.apply(this, arguments);
  }
}

export function constantly(value){
  return function(){
    return value;
  }
}

export const always = constantly;

export function noop(){
}

export function add(a, b){
  return a + b;
}

export function subtract(a, b){
  return a - b;
}

export function eq(a, b){
  return a == b;
}

export function lookup(obj, key){
  return obj[key];
}

export function juxt(){
  var fs = slice(arguments);
  return function(){
    var self = this,
        args = slice(arguments);
    return reduce(fs, function(memo, f){
      return memo.concat([f.apply(self, args)]);
    }, []);
  }
}

export function odd(n){
  return n % 2;
}

export const even = complement(odd);