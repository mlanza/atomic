import {comp, isNil, slice, partial, apply, reducing, reduced, curry} from "./types";
import {reduce, isSequential, IComparable} from "./protocols";
import {overload, constantly, identity} from "./core";

export function cond(obj, pred, f, ...args){
  if (pred(obj)) {
    return f(obj);
  } else if (args.length) {
    return cond.apply(null, [obj, pred, f].concat(args))
  } else {
    return null;
  }
}

export function and(obj, ...fs){
  return reduce(function(memo, f){
    return memo ? f(obj) : reduced(memo);
  }, true, fs);
}

export function or(obj, ...fs){
  return reduce(function(memo, f){
    return memo ? reduced(memo) : f(obj);
  }, false, fs);
}

export function branch3(obj, pred, yes){
  return branch4(obj, pred, yes, constantly(null));
}

export function branch4(obj, pred, yes, no){
  return pred(obj) ? yes(obj) : no(obj);
}

export const branch = overload(null, null, null, branch3, branch4);

function everyPair2(pred, xs){
  var every = xs.length > 0;
  while(every && xs.length > 1){
    every = pred(xs[0], xs[1]);
    xs = slice(xs, 1);
  }
  return every;
}

const everyPair = overload(null, curry(everyPair2, 2), everyPair2);

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
    return reduce(function(result, pred){
      let r = apply(pred, args);
      return r ? reduced(r) : result;
    }, false, preds);
  }
}

export const someFn = overload(null, someFn1, someFn2, someFn3, someFnN);

export function isIdentical(x, y){ //TODO via protocol
  return x === y;
}

export function compare(x, y){
  if (isIdentical(x, y)) {
    return 0
  } else if (isNil(x)) {
    return -1;
  } else if (isNil(y)) {
    return 1;
  } else if (type(x) === type(y)) {
    return IComparable.compare(x, y);
  }
}

function lt2(a, b){
  return a < b;
}

function ltN(...args){
  return everyPair(lt2, args);
}

export const lt = overload(constantly(false), constantly(true), lt2, ltN);

function lte2(a, b){
  return a <= b;
}

function lteN(...args){
  return everyPair(lte2, args);
}

export const lte = overload(constantly(false), constantly(true), lte2, lteN);

function gt2(a, b){
  return a > b;
}

function gtN(...args){
  return everyPair(gt2, args);
}

export const gt = overload(constantly(false), constantly(true), gt2, gtN);

function gte2(a, b){
  return a >= b;
}

function gteN(...args){
  return everyPair(gte2, args);
}

export const gte = overload(constantly(false), constantly(true), gte2, gteN);

function eq2(a, b){
  return a === b;
}

function eqN(...args){
  return everyPair(eq2, args);
}

export const eq = overload(constantly(true), constantly(true), eq2, eqN);

function notEq2(a, b){
  return a !== b;
}

function notEqN(...args){
  return !everyPair(eq2, args);
}

export const notEq = overload(constantly(true), constantly(true), notEq2, notEqN);

function equal2(a, b){
  return a == b;
}

function equalN(...args){
  return everyPair(equal2, args);
}

export const equal = overload(constantly(true), constantly(true), equal2, equalN);

function min2(x, y){
  return x < y ? x : y;
}

function max2(x, y){
  return x > y ? x : y;
}

export const min = overload(null, identity, min2, reducing(min2));
export const max = overload(null, identity, max2, reducing(max2));

export function everyPred(...preds){
  return function(){
    return reduce(function(memo, arg){
      return reduce(function(memo, pred){
        var result = memo && pred(arg);
        return result ? result : reduced(result);
      }, memo, preds);
    }, true, slice(arguments))
  }
}