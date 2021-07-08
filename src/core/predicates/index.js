import {overload, constantly, identity, slice} from "../core.js";
import {reduced} from "../types/reduced.js";
import {apply} from "../types/function/concrete.js";
import {mapa} from "../types/lazy-seq/concrete.js";
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
    return p.reduce(function(result, pred){
      let r = apply(pred, args);
      return r ? reduced(r) : result;
    }, false, preds);
  }
}

export const someFn = overload(null, someFn1, someFn2, someFn3, someFnN);

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
