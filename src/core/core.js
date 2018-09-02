export const unbind = Function.call.bind(Function.bind, Function.call);

export function noop(){
}

export function complement(f){
  return function(){
    return !f.apply(this, arguments);
  }
}

export function invokes(self, method, ...args){
  return self[method].apply(self, args);
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

export const placeholder = {};

export function part(f, ...xs){
  return xs.indexOf(placeholder) > -1 ? function(...ys){
    const args = [f], xl = xs.length, yl = ys.length;
    let a = 0, b = 0;
    while(a < xl && b < yl){
      if (xs[a] === placeholder) {
        a++;
        args.push(ys[b++]);
      } else {
        args.push(xs[a++]);
      }
    }
    while(a < xl){
      args.push(xs[a++]);
    }
    while(b < yl){
      args.push(ys[b++]);
    }
    return part.apply(null, args);
  } : f.apply(null, xs);
}

export function partial(f, ...applied){
  return function(...args){
    return f.apply(this, applied.concat(args));
  }
}

export function partly(f){
  return partial(part, f);
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

export function does(...effects){
  return function(...args){
    const len = effects.length;
    for(var i = 0; i < len; i++){
      const effect = effects[i];
      effect(...args);
    }
  }
}

//TODO unnecessary if CQS pattern is that commands return self
export function doing(effect){ //mutating counterpart to `reducing`
  return function(self, ...values){
    const len = values.length;
    for(var i = 0; i < len; i++){
      const value = values[i];
      effect(self, value);
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

export function applying(...args){
  return function(f){
    return f.apply(this, args);
  }
}

export function constructs(Type) {
  return function(...args){
    return new (Function.prototype.bind.apply(Type, [null].concat(args)));
  }
}

function branch1(pred){
  return branch2(pred, identity);
}

function branch2(pred, yes){
  return branch3(pred, yes, constantly(null));
}

function branch3(pred, yes, no){
  return function(...args){
    return pred(...args) ? yes(...args) : no(...args);
  }
}

export const branch = overload(null, branch1, branch2, branch3);