import {overload, complement, constantly, identity, slice} from "../core.js";
import {reduced} from "../types/reduced.js";
import {apply} from "../types/function/concrete.js";
import {mapa, detect, some} from "../types/lazy-seq/concrete.js";
import {isNil} from "../types/nil/construct.js";
import {indexed} from "../types/indexed/construct.js";
import {maybe} from "../types/maybe/construct.js";
import * as p from "./protocols.js";

export function both(memo, value){
  return memo && value;
}

export function either(memo, value){
  return memo || value;
}

export const all = overload(null, identity, both  , p.reducing(both));
export const any = overload(null, identity, either, p.reducing(either));

export function and(...preds){
  return function(...args){
    return p.reduce(function(memo, pred){
      return memo ? pred(...args) : reduced(memo);
    }, true, preds);
  }
}

export function or(...preds){
  return function(...args){
    return p.reduce(function(memo, pred){
      return memo ? reduced(memo) : pred(...args);
    }, false, preds);
  }
}

export function signature(...preds){
  return function(...values){
    return p.reducekv(function(memo, idx, pred){
      return memo ? !pred || pred(values[idx]) : reduced(memo);
    }, p.count(preds) === p.count(values), preds);
  }
}

export function signatureHead(...preds){
  return function(...values){
    return p.reducekv(function(memo, idx, value){
      let pred = preds[idx];
      return memo ? !pred || pred(value) : reduced(memo);
    }, true, values);
  }
}

export function everyPair(pred, xs){
  let every = xs.length > 0;
  while(every && xs.length > 1){
    every = pred(xs[0], xs[1]);
    xs = slice(xs, 1);
  }
  return every;
}

export function isIdentical(x, y){
  return x === y; //TODO Object.is?
}

function lt2(a, b){
  return p.compare(a, b) < 0;
}

function ltN(...args){
  return everyPair(lt2, args);
}

export const lt = overload(constantly(false), constantly(true), lt2, ltN);

const lte2 = or(lt2, p.equiv);

function lteN(...args){
  return everyPair(lte2, args);
}

export const lte = overload(constantly(false), constantly(true), lte2, lteN);

function gt2(a, b){
  return p.compare(a, b) > 0;
}

function gtN(...args){
  return everyPair(gt2, args);
}

export const gt = overload(constantly(false), constantly(true), gt2, gtN);

const gte2 = or(p.equiv, gt2);

function gteN(...args){
  return everyPair(gte2, args);
}

export const gte = overload(constantly(false), constantly(true), gte2, gteN);

function eqN(...args){
  return everyPair(p.equiv, args);
}

export const eq = overload(constantly(true), constantly(true), p.equiv, eqN);

export function notEq(...args){
  return !eq(...args);
}

export function mapArgs(xf, f){
  return function(){
    return apply(f, mapa(maybe(?, xf), indexed(arguments)));
  }
}

export function everyPred(...preds){
  return function(){
    return p.reduce(function(memo, arg){
      return p.reduce(function(memo, pred){
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
