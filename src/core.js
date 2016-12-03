import unbind from './unbind';
import Reduced from './types/reduced';

export const log = console.log.bind(console);
export const slice = unbind(Array.prototype.slice);
export const assign = Object.assign;

export function reduce(xs, xf, init, from){
  var memo = init, len = xs.length;
  for(var i = from || 0; i < len; i++){
    if (memo instanceof Reduced)
      break;
    memo = xf(memo, xs[i]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function reduceKv(xs, xf, init, from){
  var memo = init, len = xs.length;
  for(var i = from || 0; i < len; i++){
    if (memo instanceof Reduced)
      break;
    memo = xf(memo, i, xs[i]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function identity(value){
  return value;
}

export function initial(self){
  return slice(self, 0, self.length - 1);
}

export function partial(f){
  var applied = slice(arguments, 1);
  return function(){
    return f.apply(this, applied.concat(slice(arguments)));
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
  } : curry(f, f.length || 2);
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

export function overload(){
  return arities(arguments, arguments[arguments.length - 1]);
}

export function nullary(f){
  return function(){
    return f();
  }
}

export function unary(f){
  return function(one){
    return f(one);
  }
}

export function binary(f){
  return function(one, two){
    return f(one, two);
  }
}

export function ternary(f){
  return function(one, two, three){
    return f(one, two, three);
  }
}

function _arity(len, f){ //f.length not discernible
  return function(){
    return f.apply(this, slice(arguments, 0, len));
  }
}

export function arity(len, f){
  return ([nullary, unary, binary, ternary][len] || partial(_arity, len))(f);
}

export function flop(f, len){
  var l = len || f.length;
  return curry(arity(l, function(){
    var size = arguments.length,
        last = arguments[size - 1],
        tail = slice(arguments, 0, size - 1),
        args = [last].concat(tail);
    return f.apply(this, args);
  }), l);
}

export function flip(f){
  return function(two, one){
    return arguments.length === 2 ? f.call(this, one, two) : f.apply(this, [one, two].concat(slice(arguments, 2)));
  }
}

export function subj(f){
  return function(){
    const params = slice(arguments);
    return function(obj){
      return f.apply(this, [obj].concat(params));
    }
  }
}

export function partially(f){
  return function(){
    return partial.apply(this, [f].concat(slice(arguments)));
  }
}

export function reversed(f){
  return function(){
    return f.apply(this, slice(arguments).reverse());
  }
}

export function int(x){
  return x == null ? 0 : parseInt(x);
}

export function float(x){
  return x == null ? 0 : parseFloat(x);
}

export function chain(init){
  return reduce(arguments, function(value, f){
    return f(value);
  }, init, 1);
}

export function maybe(init){
  return reduce(arguments, function(value, f){
    return value == null ? new Reduced(null) : f(value);
  }, init, 1);
}

export const pipe = subj(chain);
export const opt  = subj(maybe);
export const comp = reversed(pipe);

export function multimethod(dispatch){
  return function(){
    const f = dispatch.apply(this, arguments);
    return f.apply(this, arguments);
  }
}

function route(get, fallback, value){
  const f = get(value == null ? null : value.constructor);
  return f ? f : value != null && value.__proto__.constructor !== Object ? dispatch(get, fallback, value.__proto__) : fallback;
}

export function method(fallback){
  const map = new Map(),
        set = map.set.bind(map),
        get = partial(route, map.get.bind(map), fallback);
  return Object.assign(multimethod(get), {get, set});
}

export function constantly(value){
  return function(){
    return value;
  }
}

export function noop(){
}

export function reducing(reducer){
  return function(x){
    return reduce(arguments, reducer, x, 1);
  }
}

export function subtract(a, b){
  return a - b;
}

export function add(a, b){
  return a + b;
}

export function multiply(a, b){
  return a * b;
}

export function divide(a, b){
  return a / b;
}

export function isIdentical(a, b){
  return a === b;
}

export const rand = Math.random;
export const inc  = partial(add, +1);
export const dec  = partial(add, -1);

export function clamp(min, max, n){
  return n < min ? min : n > max ? max : n;
}

export function isSome(x){
  return x != null;
}

export function isNil(x){
  return x == null;
}

export function isZero(x){
  return x === 0;
}

export function isPos(x){
  return x > 0;
}

export function isNeg(x){
  return x < 0;
}

export function tap(f, x){
  f(x);
  return x;
}

export const see = partial(tap, log); //use with chain, pipe, comp to observe intermediaries

export function rem(n, div){
  return n % div;
}

export function key(pair){
  return pair[0] || null;
}

export function val(pair){
  return pair[1] || null;
}

export function posn(n, f){
  return function(){
    return f(arguments[n]);
  }
}

export const fst = partial(posn, 0);
export const snd = partial(posn, 1);

export function isOdd(n){
  return n % 2;
}

export const isEven  = complement(isOdd);
export const isTrue  = partial(isIdentical, true);
export const isFalse = partial(isIdentical, false);

export function is(constructor, value) {
  return value != null && value.constructor === constructor;
}

export function branch(value, pred, f){
  return pred ? pred(value) ? f(value) : branch.apply(this, [value].concat(slice(arguments, 3))) : null;
}

export const cond = subj(branch);

export function memoize(f){
  return memoizeWith(identity, f);
}

export function memoizeWith(hash, f){
  const cache = {};
  return function(){
    var key = hash.apply(this, arguments);
    if (cache.hasOwnProperty(key))
      return cache[key];
    return cache[key] = f.apply(this, arguments);
  }
}

export function delay(f){ //a.k.a. once
  return memoizeWith(f, BLANK);
}

export function juxt(){
  var fs = arguments;
  return function(){
    var self = this,
        args = slice(arguments);
    return reduce(fs, function(memo, f){
      return memo.concat([f.apply(self, args)]);
    }, []);
  }
}

export function doto(){
  var f = juxt.apply(this, arguments);
  return function(value){
    f(value);
  }
}

export function supply(){
  const args = arguments;
  return function(f){
    return f.apply(this, args);
  }
}

export function invoke(method, ...args){
  return function(obj){
    return obj[method].apply(this, args);
  }
}

export function detach(f){
  return function(obj, ...args){
    return f.apply(obj, args);
  }
}

export function spread(f){
  return function(values){
    return f.apply(this, values);
  }
}

export function unspread(f){
  return function(){
    return f(slice(arguments));
  }
}

export function not(value){
  return !value;
}

function s4() {
  return Math.floor((1 + rand()) * 0x10000).toString(16).substring(1);
}

export function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function lastly(x, ...xs){
  if (!xs.length) return x;
  return x ? lastly.apply(this, xs) : x;
}

export function firstly(x, ...xs){
  if (!xs.length) return x;
  return x ? x : firstly.apply(this, xs);
}

export const BLANK = constantly("");
export const NIL   = constantly(null);
export const TRUE  = constantly(true);
export const FALSE = constantly(false);
export const ZERO  = constantly(0);
export const ONE   = constantly(1);