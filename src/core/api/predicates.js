import {overload, constantly, identity, type} from "../core";
import {IReduce, IKVReduce, ICounted, IComparable, IEquiv, isSequential} from "../protocols";
import {reduced} from "../types/reduced";
import {comp, partial, apply, reducing} from "../types/function/concrete";
import {isNil} from "../types/nil/construct";
import {slice} from "../types/array/concrete";

export function both(memo, value){
  return memo && value;
}

export function either(memo, value){
  return memo || value;
}

export const all = overload(null, identity, both  , reducing(both));
export const any = overload(null, identity, either, reducing(either));

export function and(...preds){
  return function(...args){
    return IReduce.reduce(preds, function(memo, pred){
      return memo ? pred(...args) : reduced(memo);
    }, true);
  }
}

export function or(...preds){
  return function(...args){
    return IReduce.reduce(preds, function(memo, pred){
      return memo ? reduced(memo) : pred(...args);
    }, false);
  }
}

export function signature(...preds){
  return function(...values){
    return IKVReduce.reducekv(preds, function(memo, idx, pred){
      return memo ? !pred || pred(values[idx]) : reduced(memo);
    }, ICounted.count(preds) === ICounted.count(values));
  }
}

export function guard(pred, value){
  return function(...args){
    return pred(...args) ? value : null;
  }
}

function fork1(pred){
  return fork2(pred, identity);
}

function fork2(pred, yes){
  return fork3(pred, yes, constantly(null));
}

function fork3(pred, yes, no){
  return function(...args){
    return pred(...args) ? yes(...args) : no(...args);
  }
}

export const fork = overload(null, fork1, fork2, fork3);

export function unless(pred, f){
  return fork(pred, identity, f);
}

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
    return IReduce.reduce(preds, function(result, pred){
      let r = apply(pred, args);
      return r ? reduced(r) : result;
    }, false);
  }
}

export const someFn = overload(null, someFn1, someFn2, someFn3, someFnN);

export function isIdentical(x, y){
  return x === y; //TODO Object.is?
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
  return compare(a, b) < 0;
}

function ltN(...args){
  return everyPair(lt2, args);
}

export const lt = overload(constantly(false), constantly(true), lt2, ltN);

const lte2 = or(lt2, eq2);

function lteN(...args){
  return everyPair(lte2, args);
}

export const lte = overload(constantly(false), constantly(true), lte2, lteN);

function gt2(a, b){
  return compare(a, b) > 0;
}

function gtN(...args){
  return everyPair(gt2, args);
}

export const gt = overload(constantly(false), constantly(true), gt2, gtN);

const gte2 = or(eq2, gt2);

function gteN(...args){
  return everyPair(gte2, args);
}

export const gte = overload(constantly(false), constantly(true), gte2, gteN);

function eq2(a, b){
  return IEquiv.equiv(a, b);
}

function eqN(...args){
  return everyPair(eq2, args);
}

export const eq = overload(constantly(true), constantly(true), eq2, eqN);

export function notEq(...args){
  return !eq(...args);
}

export function everyPred(...preds){
  return function(){
    return IReduce.reduce(slice(arguments), function(memo, arg){
      return IReduce.reduce(preds, function(memo, pred){
        var result = memo && pred(arg);
        return result ? result : reduced(result);
      }, memo);
    }, true)
  }
}

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
    var result = f.apply(this, arguments);
    if (!pred(result)) {
      throw new TypeError("Failed post-condition.");
    }
    return result;
  }
}