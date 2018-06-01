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
    const f = fs[arguments.length] || fallback;
    return f.apply(this, arguments);
  }
}

export function subj(f){ //subjective
  return function(...args){
    return function(obj){
      return f.apply(null, [obj].concat(args));
    }
  }
}

export function obj(f){ //objective
  return function(...args){
    return function(obj){
      return f.apply(null, [args].concat(obj));
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

