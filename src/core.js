import Reduced from './types/reduced/construct';

export const unbind    = Function.call.bind(Function.bind, Function.call);
export const slice     = unbind(Array.prototype.slice);
export const isArray   = Array.isArray.bind(Array);
export const lowerCase = unbind(String.prototype.toLowerCase);
export const upperCase = unbind(String.prototype.toUpperCase);
export const trim      = unbind(String.prototype.trim);
export const log       = console.log.bind(console);
export const array     = Array;

export const EMPTY_ARRAY  = Object.freeze([]);
export const EMPTY_OBJECT = Object.freeze({});
export const EMPTY_STRING = "";

export function isNil(x){
  return x == null;
}

export function isString(s){
  return s && typeof s === "string";
}

export function type(self){
  return self == null ? null : self.constructor;
}

export function reduce(xs, xf, init, from){
  var memo = init, len = xs.length;
  for(var i = from || 0; i < len; i++){
    if (memo instanceof Reduced)
      break;
    memo = xf(memo, xs[i]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function reducekv(xs, xf, init, from){
  var memo = init, len = xs.length;
  for(var i = from || 0; i < len; i++){
    if (memo instanceof Reduced)
      break;
    memo = xf(memo, i, xs[i]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function overload(){
  var fs = arguments, fallback = fs[fs.length - 1];
  return function(){
    var f = fs[arguments.length] || fallback;
    return f.apply(this, arguments);
  }
}

function curry1(f){
  return curry2(f, f.length);
}

function curry2(f, minimum){
  return function(){
    var applied = slice(arguments);
    if (applied.length >= minimum) {
      return f.apply(this, applied);
    } else {
      return curry2(function(){
        return f.apply(this, applied.concat(slice(arguments)));
      }, minimum - applied.length);
    }
  }
}

export const curry = overload(null, curry1, curry2);

export function nullary(f){
  return function(){
    return f.call(this);
  }
}

export function unary(f){
  return function(a){
    return f.call(this, a);
  }
}

export function binary(f){
  return function(a, b){
    return f.call(this, a, b);
  }
}

export function ternary(f){
  return function(a, b, c){
    return f.call(this, a, b, c);
  }
}

export function quaternary(f){
  return function(a, b, c, d){
    return f.call(this, a, b, c, d);
  }
}

export function nary(f, length){
  return function(){
    return f.apply(this, slice(arguments, 0, length));
  }
}

export function arity(f, length){
  return ([nullary, unary, binary, ternary, quaternary][length] || nary)(f, length);
}

export function identity(x){
  return x;
}

export function constantly(x){
  return function(){
    return x;
  }
}

export function partial(f){
  var applied = Array.prototype.slice.call(arguments, 1);
  return function(){
    return f.apply(this, applied.concat(Array.prototype.slice.call(arguments)));
  }
}

export function reducing(rf){
  return function r(x, ...tail){
    return tail.length ? rf(x, r.apply(null, tail)) : x;
  }
}

export function complement(f){
  return function(){
    return !f.apply(this, arguments);
  }
}

export function subj(f){
  return function(){
    const args = slice(arguments);
    return function(obj){
      return f.apply(this, [obj].concat(args));
    }
  }
}

function reversed(f){
  return function(){
    return f.apply(this, slice(arguments).reverse());
  }
}


function piping1(reducer){
  return partial(pipingN, reducer);
}

function pipingN(reducer, f, ...fs){
  return function(init, ...args){
    return reduce(fs, reducer, reducer(init, function(memo){
      return f.apply(this, [memo].concat(args));
    }));
  }
}

export const piping = overload(null, piping1, pipingN);

function chaining1(reducer){
  return partial(chainingN, reducer);
}

function chainingN(reducer, init, ...fs){
  return reduce(fs, reducer, init);
}

export const chaining = overload(null, chaining1, chainingN);

function identityReducer(memo, f){
  return f(memo);
}

function someReducer(memo, f){
  return isNil(memo) ? new Reduced(null) : f(memo);
}

function errorReducer(memo, f){
  if (memo instanceof Error) {
    return new Reduced(memo);
  }
  try {
    return f(memo);
  } catch (ex) {
    return ex;
  }
}

function composeReducer2(r1, r2){
  return function(memo, f){
    return r2(memo, function(memo){
      return r1(memo, f);
    });
  }
}

function composeReducerN(r1, r2, ...rs){
  const r = composeReducer2(r1, r2);
  return rs.length ? composeReducerN.apply(this, [r].concat(rs)) : r;
}

export const composeReducer = overload(null, identity, composeReducer2, composeReducerN);

export const chain   = chaining(identityReducer);
export const maybe   = chaining(someReducer);
export const handles = chaining(errorReducer);

function pipe2(a, b){
  return function(){
    return b(a.apply(this, arguments));
  }
}

function pipe3(a, b, c){
  return function(){
    return c(b(a.apply(this, arguments)));
  }
}

function pipe4(a, b, c, d){
  return function(){
    return d(c(b(a.apply(this, arguments))));
  }
}

export const pipe = overload(null, identity, pipe2, pipe3, pipe4, piping(identityReducer));
export const opt  = piping(someReducer);
export const comp = reversed(pipe);

export function doto(obj, ...effects){
  effects.forEach(function(effect){
    effect(obj);
  }, effects);
  return obj;
}

export function juxt(...fs){
  return function(...args){
    return reduce(fs, function(memo, f){
      return memo.concat([f.apply(this, args)]);
    }, []);
  }
}

export function length(self){
  return self.length;
}

export function multimethod(dispatch){
  return function(){
    const f = dispatch.apply(this, arguments);
    return f.apply(this, arguments);
  }
}

export function constructs(Type) {
  return function(...args){
    return new (Function.prototype.bind.apply(Type, [null].concat(args)));
  }
}

export function isSome(x){
  return x != null;
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

export function isOdd(n){
  return n % 2;
}

export const isEven  = complement(isOdd);
