import Symbol from "symbol";
export const unbind = Function.call.bind(Function.bind, Function.call);
export const slice = unbind(Array.prototype.slice);
export const indexOf = unbind(Array.prototype.indexOf);
export const log = console.log.bind(console);
export const warn = console.warn.bind(console);
export const info = console.info.bind(console);
export const debug = console.debug.bind(console);

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

export function plug(f){ //apply placeholders and, optionally, values returning a partially applied function which is executed when all placeholders are supplied.
  const xs = slice(arguments, 1), n = xs.length;
  return xs.indexOf(placeholder) < 0 ? f.apply(null, xs) : function() {
    const ys = slice(arguments),
          zs = [];
    for (let i = 0; i < n; i++) {
      let x = xs[i];
      zs.push(x === placeholder && ys.length ? ys.shift() : x);
    }
    return plug.apply(null, [f].concat(zs).concat(ys));
  }
}

export function partial(f, ...applied){
  return function(...args){
    return f.apply(this, applied.concat(args));
  }
}

export function partly(f){
  return partial(plug, f);
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
  for(let i = 0; i < len; i++){
    const effect = effects[i];
    effect(obj);
  }
  return obj;
}

export function does(...effects){
  const len = effects.length;
  return function doing(...args){
    for(let i = 0; i < len; i++){
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

export const ako = isInstance;

export function kin(self, other){
  return other != null && self != null && other.constructor === self.constructor;
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

function branch3(pred, yes, no){
  return function(...args){
    return pred(...args) ? yes(...args) : no(...args);
  }
}

function branchN(pred, f, ...fs){
  return function(...args){
    return pred(...args) ? f(...args) : branch(...fs)(...args);
  }
}

export const branch = overload(null, null, null, branch3, branchN);

function guard1(pred){
  return guard2(pred, identity);
}

function guard2(pred, f){
  return branch3(pred, f, noop);
}

export const guard = overload(null, guard1, guard2);

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

export function attach(f){
  return function(...args){
    return f.apply(null, [this].concat(args));
  }
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

export function pre(f, pred){
  return function(){
    if (!pred.apply(this, arguments)) {
      throw new TypeError("Failed pre-condition.");
    }
    return f.apply(this, arguments);
  }
}

export function post(f, pred){
  return function(){
    let result = f.apply(this, arguments);
    if (!pred(result)) {
      throw new TypeError("Failed post-condition.");
    }
    return result;
  }
}

function called4(fn, message, context, log){
  return function(){
    const meta = Object.assign({}, context, {fn, arguments});
    log(message, meta);
    return meta.results = fn.apply(this, arguments);
  }
}

function called3(fn, message, context){
  return called4(fn, message, context, warn);
}

function called2(fn, message){
  return called3(fn, message, {});
}

export const called = overload(null, null, called2, called3, called4);
