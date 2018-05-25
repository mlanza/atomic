import {comp, isNil, slice, partial, apply, reducing, reduced} from "./types";
import {reduce, reducekv, count, isSequential, IComparable} from "./protocols";
import {overload, constantly, identity, subj} from "./core";

export function and(...preds){
  return function(...args){
    return reduce(preds, function(memo, pred){
      return memo ? pred(...args) : reduced(memo);
    }, true);
  }
}

export function or(...preds){
  return function(...args){
    return reduce(preds, function(memo, pred){
      return memo ? reduced(memo) : pred(...args);
    }, false);
  }
}

export function signature(...preds){
  return function(...values){
    return reducekv(preds, function(memo, idx, pred){
      return memo ? pred(values[idx]) : reduced(memo);
    }, count(preds) === count(values));
  }
}

export function guard(pred, value){
  return function(...args){
    return pred(...args) ? value : null;
  }
}

export function branch3(pred, yes, obj){
  return branch4(pred, yes, constantly(null), obj);
}

export function branch4(pred, yes, no, obj){
  return pred(obj) ? yes(obj) : no(obj);
}

export const branch = overload(null, null, null, branch3, branch4);

export function everyPair(pred, xs){
  var every = xs.length > 0;
  while(every && xs.length > 1){
    every = pred(xs[0], xs[1]);
    xs = slice(xs, 1);
  }
  return every;
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
      return r ? reduced(r) : result;
    }, false);
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
  } else {
    throw new TypeError("Cannot compare different types.");
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
    return reduce(slice(arguments), function(memo, arg){
      return reduce(preds, function(memo, pred){
        var result = memo && pred(arg);
        return result ? result : reduced(result);
      }, memo);
    }, true)
  }
}

export function pre(f, ...preds){
  let check = and(...preds);
  return function(){
    if (!check.apply(this, arguments)) {
      throw new TypeError("Failed pre-condition.");
    }
    return f.apply(this, arguments);
  }
}

export function post(f, ...preds){
  var check = or(...preds);
  return function(){
    var result = f.apply(this, arguments);
    if (!check(result)) {
      throw new TypeError("Failed post-condition.");
    }
    return result;
  }
}