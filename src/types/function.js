import {overload, identity, unbind, constantly} from "../core";
import {toArray}  from "../protocols";
import {isNil}  from "../types/nil";
import {slice}  from "../types/array";
import {isBlank}  from "../types/string";
import {Reduced, reduce}  from "../types/reduced";

export function constructs(Type) {
  return function(...args){
    return new (Function.prototype.bind.apply(Type, [null].concat(args)));
  }
}

function curry1(f){
  return curry2(f, f.length);
}

function curry2(f, minimum){
  return function(...applied){
    if (applied.length >= minimum) {
      return f.apply(this, applied);
    } else {
      return curry2(function(...args){
        return f.apply(this, applied.concat(args));
      }, minimum - applied.length);
    }
  }
}

export const curry = overload(null, curry1, curry2);

export function branch(pred, yes, no){
  return function(value){
    return pred(value) ? yes(value) : no(value);
  }
}

export function guard(pred, yes){
  return branch(pred, yes, constantly(null));
}

export function juxt(...fs){
  return function(...args){
    return reduce(fs, function(memo, f){
      return memo.concat([f.apply(this, args)]);
    }, []);
  }
}

export function multimethod(dispatch){
  return function(...args){
    const f = apply(dispatch, args);
    return apply(f, args);
  }
}

export function complement(f){
  return function(){
    return !f.apply(this, arguments);
  }
}

export function tap(f){
  return function(value){
    f(value);
    return value;
  }
}

export function reversed(f){
  return function(...args){
    return f.apply(this, args.reverse());
  }
}

export function partial(f, ...applied){
  return function(...args){
    return f.apply(this, applied.concat(args));
  }
}

export function subj(f){
  return function(...args){
    return function(obj){
      return apply(f, obj, args);
    }
  }
}

function apply2(f, args){
  return f.apply(null, toArray(args));
}

function apply3(f, a, args){
  return f.apply(null, [a].concat(toArray(args)));
}

function apply4(f, a, b, args){
  return f.apply(null, [a, b].concat(toArray(args)));
}

function apply5(f, a, b, c, args){
  return f.apply(null, [a, b, c].concat(toArray(args)));
}

function applyN(f, a, b, c, d, args){
  return f.apply(null, [a, b, c, d].concat(toArray(args)));
}

export const apply = overload(null, null, apply2, apply3, apply4, apply5, applyN);

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

function fnil(f, ...ARGS){
  return function(...args){
    for(var x = 0; x < args.length; x++){
      if (isNil(args[x])) { args[x] = ARGS[x] };
    }
    return f.apply(null, args);
  }
}

function someFn1(a){
  return function(){
    return apply(a, arguments);
  }
}

function someFn2(a, b){
  return function(){
    return apply(a, arguments) || apply(b, arguments);
  }
}

function someFn3(a, b, c){
  return function(){
    return apply(a, arguments) || apply(b, arguments) || apply(c, arguments);
  }
}

function someFnN(...preds){
  return function(...args){
    return reduce(preds, function(result, pred){
      let r = apply(pred, args);
      return r ? new Reduced(r) : result;
    }, false);
  }
}

export const someFn = overload(null, someFn1, someFn2, someFn3, someFnN);

function piping1(reducer){
  return function(f, ...fs){
    return function(init, ...args){
      return reduce(fs, reducer, reducer(init, function(memo){
        return f.apply(this, [memo].concat(args));
      }));
    }
  }
}

function pipingN(...reducers){
  return piping1(composeReducer(...reducers));
}

export const piping = overload(constantly(piping1(identityReducer)), piping1, pipingN);

function chaining1(reducer){
  return function(init, ...fs){
    return reduce(fs, reducer, init);
  }
}

function chainingN(...reducers){
  return chaining1(composeReducer(...reducers));
}

export const chaining = overload(constantly(chaining1(identityReducer)), chaining1, chainingN);

function composeReducer2(r1, r2){
  return function(memo, f){
    return r2(memo, function(memo){
      return r1(memo, f);
    });
  }
}

function composeReducerN(r1, r2, ...rs){
  const r = composeReducer2(r1, r2);
  return rs.length ? composeReducerN.apply(this, [r].concat(rs)) : r;
}

export const composeReducer = overload(null, identity, composeReducer2, composeReducerN);

export function identityReducer(memo, f){
  return f(memo);
}

export function someReducer(memo, f){
  return isNil(memo) || isBlank(memo) ? new Reduced(null) : f(memo);
}

export function promiseReducer(memo, f){
  return Promise.resolve(memo).then(f);
}

export function errorReducer(memo, f){
  if (memo instanceof Error) {
    return new Reduced(memo);
  }
  try {
    return f(memo);
  } catch (ex) {
    return ex;
  }
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

export const pipe   = overload(null, identity, pipe2, pipe3, pipe4, piping());
export const opt    = piping(someReducer);
export const prom   = piping(promiseReducer);
export const handle = piping(errorReducer);
export const comp   = reversed(pipe);
export const chain  = chaining();

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
