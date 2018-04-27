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

export function overload(){
  var fs = arguments;
  return function(){
    var f = fs[arguments.length] || fs[fs.length - 1];
    return f.apply(this, arguments);
  }
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

export function chain(init){
  return reduce(arguments, function(value, f){
    return f(value);
  }, init, 1);
}

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

function pipeN(f){
  var fs = slice(arguments, 1);
  return function(){
    return reduce(fs, function(memo, rf){
      return rf(memo);
    }, f.apply(this, arguments))
  }
}

export const pipe = overload(null, identity, pipe2, pipe3, pipe4, pipeN);
export const comp = reversed(pipe);

export function doto(obj, ...effects){
  effects.forEach(function(effect){
    effect(obj);
  }, effects);
  return obj;
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