import {Nil} from "./types/nil/construct.js";
export const unbind = Function.call.bind(Function.bind, Function.call);
export const slice = unbind(Array.prototype.slice);
export const indexOf = unbind(Array.prototype.indexOf);

export function type(self){
  return self == null ? Nil : self.constructor;
}

export function isFunction(f){
  return typeof f === "function";
}

export function isSymbol(self){
  return typeof self === "symbol";
}

export function isString(self){
  return typeof self === "string";
}

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

export function comp(){
  const fs = arguments, start = fs.length - 2, f = fs[fs.length - 1];
  return function(){
    let memo = f.apply(this, arguments);
    for(let i = start; i > -1; i--) {
      const f = fs[i];
      memo = f.call(this, memo);
    }
    return memo;
  }
}

export function pipe(f, ...fs){
  return arguments.length ? function(){
    let memo = f.apply(this, arguments);
    for(let i = 0; i < fs.length; i++) {
      const f = fs[i];
      memo = f.call(this, memo);
    }
    return memo;
  } : identity;
}

export function overload(){
  const fs = arguments, fallback = fs[fs.length - 1];
  return function(){
    const f = fs[arguments.length] || (arguments.length >= fs.length ? fallback : null);
    return f.apply(this, arguments);
  }
}

export function handle(){
  const handlers = slice(arguments, 0, arguments.length - 1),
        fallback = arguments[arguments.length -1];
  return function(){
    for(let handler of handlers){
      const check = handler[0];
      if (check.apply(this, arguments)) {
        const fn = handler[1];
        return fn.apply(this, arguments);
      }
    }
    return fallback.apply(this, arguments);
  }
}

export function assume(pred, obj, f){
  return handle([pred, f], partial(f, obj));
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

function curry1(f){
  return curry2(f, f.length);
}

function curry2(f, minimum){
  return function(){
    const applied = arguments.length ? slice(arguments) : [undefined]; //each invocation assumes advancement
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
  return Object.assign(partial(plug, f), {partly: f});
}

export function unpartly(f){
  return f && f.partly ? f.partly : f;
}

export function deferring(f){
  return function(...args){
    return partial(f, ...args);
  }
}

export function factory(f, ...args){
  return deferring(partial(f, ...args));
}

export function identity(x){
  return x;
}

export function constantly(x){
  return function(){
    return x;
  }
}

export function multi(dispatch){
  return function(...args){
    const f = dispatch.apply(this, args);
    if (!f){
      throw Error("Failed dispatch");
    }
    return f.apply(this, args);
  }
}

export function tee(f){
  return function(value){
    f(value);
    return value;
  }
}

export function see(...labels){
  return tee(partial(console.log, ...labels));
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

function guard3(value, pred, f){
  return value |> guard2(pred, f);
}

export const guard = overload(null, guard1, guard2, guard3);

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

export function PreconditionError(f, pred, args) {
  this.f = f;
  this.pred = pred;
  this.args = args;
}

PreconditionError.prototype = new Error();

export function PostconditionError(f, pred, args, result) {
  this.f = f;
  this.pred = pred;
  this.args = args;
  this.result = result;
}

PostconditionError.prototype = new Error();

export function pre(f, pred){
  return function(){
    if (!pred.apply(this, arguments)) {
      throw new PreconditionError(f, pred, arguments);
    }
    return f.apply(this, arguments);
  }
}

export function post(f, pred){
  return function(){
    const result = f.apply(this, arguments);
    if (!pred(result)) {
      throw new PostconditionError(f, pred, arguments, result);
    }
    return result;
  }
}

export function nullary(f){
  return function(){
    return f();
  }
}

export function unary(f){
  return function(a){
    return f(a);
  }
}

export function binary(f){
  return function(a, b){
    return f(a, b);
  }
}

export function ternary(f){
  return function(a, b, c){
    return f(a, b, c);
  }
}

export function quaternary(f){
  return function(a, b, c, d){
    return f(a, b, c, d);
  }
}

export function nary(f, length){
  return function(){
    return f(...slice(arguments, 0, length));
  }
}

export function arity(f, length){
  return ([nullary, unary, binary, ternary, quaternary][length] || nary)(f, length);
}

export function fold(f, init, xs){
  let memo = init, to = xs.length - 1, r = {};
  for(let i = 0; i <= to; i++){
    if (memo === r)
      break;
    memo = f(memo, xs[i], (reduced) => r = reduced);
  }
  return memo;
}

export function foldkv(f, init, xs){
  let memo = init, len = xs.length, r = {};
  for(let i = 0; i < len; i++){
    if (memo === r)
      break;
    memo = f(memo, i, xs[i], (reduced) => r = reduced);
  }
  return memo;
}

export function posn(...xfs){
  return function(arr){
    return foldkv(function(memo, idx, xf){
      const val = arr[idx];
      memo.push(xf ? xf(val) : val);
      return memo;
    }, [], xfs);
  }
}

export function signature(...preds){
  return function(...values){
    return foldkv(function(memo, idx, pred, reduced){
      return memo ? !pred || pred(values[idx]) : reduced(memo);
    }, preds.length === values.length, preds);
  }
}

export function signatureHead(...preds){
  return function(...values){
    return foldkv(function(memo, idx, value, reduced){
      let pred = preds[idx];
      return memo ? !pred || pred(value) : reduced(memo);
    }, true, values);
  }
}

export function and(...preds){
  return function(...args){
    return fold(function(memo, pred, reduced){
      return memo ? pred(...args) : reduced(memo);
    }, true, preds);
  }
}

export function or(...preds){
  return function(...args){
    return fold(function(memo, pred, reduced){
      return memo ? reduced(memo) : pred(...args);
    }, false, preds);
  }
}

export function both(memo, value){
  return memo && value;
}

export function either(memo, value){
  return memo || value;
}

export function isIdentical(x, y){
  return x === y; //TODO Object.is?
}

export function everyPred(...preds){
  return function(){
    return fold(function(memo, arg){
      return fold(function(memo, pred, reduced){
        let result = memo && pred(arg);
        return result ? result : reduced(result);
      }, memo, preds);
    }, true, slice(arguments));
  }
}

function someFn1(p){
  function f1(x){
    return p(x);
  }
  function f2(x, y){
    return p(x) || p(y);
  }
  function f3(x, y, z){
    return p(x) || p(y) || p(z);
  }
  function fn(x, y, z, ...args){
    return f3(x, y, z) || some(p, args);
  }
  return overload(constantly(null), f1, f2, f3, fn);
}

function someFn2(p1, p2){
  function f1(x){
    return p1(x) || p2(x);
  }
  function f2(x, y){
    return p1(x) || p1(y) || p2(x) || p2(y);
  }
  function f3(x, y, z){
    return p1(x) || p1(y) || p1(z) || p2(x) || p2(y) || p2(z);
  }
  function fn(x, y, z, ...args){
    return f3(x, y, z) || some(or(p1, p2), args);
  }
  return overload(constantly(null), f1, f2, f3, fn);
}

function someFnN(...ps){
  function fn(...args){
    return some(or(...ps), args);
  }
  return overload(constantly(null), fn);
}

export const someFn = overload(null, someFn1, someFn2, someFnN);

function folding1(f){
  return folding2(f, identity);
}

function folding2(f, order){
  return function(x, ...xs){
    return fold(f, x, order(xs));
  }
}

export const folding = overload(null, folding1, folding2);

export const all = overload(null, identity, both, folding1(both));
export const any = overload(null, identity, either, folding1(either));

export function everyPair(pred, xs){
  let every = xs.length > 0;
  while(every && xs.length > 1){
    every = pred(xs[0], xs[1]);
    xs = slice(xs, 1);
  }
  return every;
}
