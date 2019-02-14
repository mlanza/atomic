export const unbind = Function.call.bind(Function.bind, Function.call);
export const slice = unbind(Array.prototype.slice);
export const indexOf = unbind(Array.prototype.indexOf);
export const log = console.log.bind(console);

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

export function part(f){
  const xs = slice(arguments, 1), n = xs.length;
  return xs.indexOf(placeholder) < 0 ? f.apply(null, xs) : function() {
    const ys = slice(arguments),
          zs = [];
    for (let i = 0; i < n; i++) {
      let x = xs[i];
      zs.push(x === placeholder && ys.length ? ys.shift() : x);
    }
    return part.apply(null, [f].concat(zs).concat(ys));
  }
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

export function execute(f, ...args){
  return f.apply(this, args);
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

function guard1(pred){
  return guard2(pred, identity);
}

function guard2(pred, f){
  return branch(pred, f, noop);
}

export const guard = overload(null, guard1, guard2);

export function branch(pred, yes, no){
  return function(...args){
    return pred(...args) ? yes(...args) : no(...args);
  }
}

function memoize1(f){
  return memoize2(f, function(...args){
    return JSON.stringify(args);
  });
}

function memoize2(f, hash){
  const cache = {};
  return function(){
    const key = hash.apply(this, arguments);
    if (cache.hasOwnProperty(key)) {
      return cache[key];
    } else {
      const result = f.apply(this, arguments);
      cache[key] = result;
      return result;
    }
  }
}

export const memoize = overload(null, memoize1, memoize2);

export function isNative(f) {
  return (/\{\s*\[native code\]\s*\}/).test('' + f);
}

function toggles4(on, off, want, self){
  return want(self) ? on(self) : off(self);
}

function toggles5(on, off, _, self, want){
  return want ? on(self) : off(self);
}

export const toggles = overload(null, null, null, null, toggles4, toggles5);

export function detach(method){
  return function(obj, ...args){
    return obj[method](...args);
  }
}

export function veer(n, f, g){
  let skips = n;
  return n > 0 ? function(){
    return (skips-- <= 0 ? f : g).apply(this, arguments);
  } : f;
}

export function ignore(n, f){
  return veer(n, f, noop);
}

function trampoline1(f){
  let g = f();
  while(typeof g === "function") {
    g = g();
  }
  return g;
}

function trampolineN(f, ...args){
  return trampoline1(function(){
    return f(...args);
  });
}

export const trampoline = overload(null, trampoline1, trampolineN);