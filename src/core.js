import Reduced from './types/reduced/construct';

export const unbind = Function.call.bind(Function.bind, Function.call);
export const log    = console.log.bind(console);

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

export function identity(x){
  return x;
}

export function constantly(x){
  return function(){
    return x;
  }
}

export function effect(...effects){
  return function(obj){
    effects.forEach(function(effect){
      effect(obj);
    }, effects);
  }
}

export function doto(obj, ...effects){
  effect(...effects)(obj);
  return obj;
}

export function length(self){
  return self.length;
}

export function constructs(Type) {
  return function(...args){
    return new (Function.prototype.bind.apply(Type, [null].concat(args)));
  }
}

export function isInstance(x, constructor){
  return x instanceof constructor;
}