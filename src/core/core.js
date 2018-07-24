export const unbind = Function.call.bind(Function.bind, Function.call);

export function noop(){
}

export function complement(f){
  return function(){
    return !f.apply(this, arguments);
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

export function overload(){
  const fs = arguments, fallback = fs[fs.length - 1];
  return function(){
    const f = fs[arguments.length] || (arguments.length >= fs.length ? fallback : null);
    return f.apply(this, arguments);
  }
}

export function subj(f, len){ //subjective
  const length = len || f.length;
  return function(...ys){
    return ys.length >= length ? f.apply(null, ys) : function(...xs){
      return f.apply(null, xs.concat(ys));
    }
  }
}

export function obj(f, len){ //objective
  const length = len || f.length;
  return function(...xs){
    return xs.length >= length ? f.apply(null, xs) : function(...ys){
      return f.apply(null, xs.concat(ys));
    }
  }
}

export function partial(f, ...applied){
  return function(...args){
    return f.apply(this, applied.concat(args));
  }
}

export const placeholder = {};

export function part(f, ...xs){
  if (xs.indexOf(placeholder) < 0) {
    return f.apply(null, xs);
  } else {
    return function(...ys){
      const zs = [];
      let a = 0, b = 0, xl = xs.length, yl = ys.length;
      while(a < xl && b < yl){
        if (xs[a] === placeholder) {
          a++;
          zs.push(ys[b++]);
        } else {
          zs.push(xs[a++]);
        }
      }
      while(a < xl){
        zs.push(xs[a++]);
      }
      while(b < yl){
        zs.push(ys[b++]);
      }
      return part.apply(null, [f].concat(zs));
    }
  }
}

export function partly(wrapped){
  return Object.assign(function(...args){
    return part(wrapped, ...args);
  }, {wrapped});
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
  const len = effects.length;
  for(var i = 0; i < len; i++){
    const effect = effects[i];
    effect(obj);
  }
  return obj;
}

export function effect(...effects){
  return function(...args){
    const len = effects.length;
    for(var i = 0; i < len; i++){
      const effect = effects[i];
      effect(...args);
    }
  }
}

function is1(constructor){
  return function(self){
    return is2(self, constructor);
  }
}

function is2(self, constructor){
  return self != null && self.constructor === constructor;
}

export const is = overload(null, is1, is2);

export function isInstance(self, constructor){
  return self instanceof constructor;
}

export function unspread(f){
  return function(...args){
    return f(args);
  }
}

export function once(f){
  const pending = {};
  let result = pending;
  return function(...args){
    if (result === pending){
      result = f(...args);
    }
    return result;
  }
}

export function applyTo(...args){
  return function(f){
    return f.apply(this, args);
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