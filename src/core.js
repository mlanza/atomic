import Reduced from './types/reduced/construct';

export const unbind = Function.call.bind(Function.bind, Function.call);
export const test   = unbind(RegExp.prototype.test);
export const log    = console.log.bind(console);
export const slice  = unbind(Array.prototype.slice);

export function isNil(x){
  return x == null;
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
  var applied = slice(arguments, 1);
  return function(){
    return f.apply(this, applied.concat(slice(arguments)));
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

export function reversed(f){
  return function(){
    return f.apply(this, slice(arguments).reverse());
  }
}

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

export function tap(f){
  return function(value){
    f(value);
    return value;
  }
}