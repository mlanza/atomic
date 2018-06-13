export const unbind = Function.call.bind(Function.bind, Function.call);
export const log    = console.log.bind(console);

export function noop(){
}

export function complement(f){
  return function(){
    return !f.apply(this, arguments);
  }
}

export function partial(f, ...applied){
  return function(...args){
    return f.apply(this, applied.concat(args));
  }
}

export function counter(init){
  let memo = init || 0;
  return function(){
    return memo++;
  }
}

export function type(self){
  return self == null ? null : self.constructor;
}

export function is(self, constructor){
  return self != null && self.constructor === constructor;
}

export function overload(){
  const fs = arguments, fallback = fs[fs.length - 1];
  return function(){
    const f = fs[arguments.length] || (arguments.length >= fs.length ? fallback : null);
    return f.apply(this, arguments);
  }
}

export function subj(f){ //subjective
  return function(...ys){
    return function(...xs){
      return f.apply(null, xs.concat(ys));
    }
  }
}

export function obj(f){ //objective
  return function(...xs){
    return function(...ys){
      return f.apply(null, xs.concat(ys));
    }
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

export function doto(obj, ...effects){
  effects.forEach(function(effect){
    effect(obj);
  }, effects);
  return obj;
}

export const effect = subj(doto);

export function isInstance(x, constructor){
  return x instanceof constructor;
}

export function spread(f){
  return function(args){
    return f(...args);
  }
}

export function unspread(f){
  return function(...args){
    return f(args);
  }
}

export function once(f){
  const pending = {};
  let result  = pending;
  return function(...args){
    if (result === pending){
      result = f(...args);
    }
    return result;
  }
}

export function intercept(fallback, pred, receiver){
  const next = fallback || function(){
    throw new Error("No fallback function found.");
  }
  return function(...args){
    return pred(...args) ? receiver(...args) : next(...args);
  }
}