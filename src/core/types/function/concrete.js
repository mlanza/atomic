import {overload, identity, partial, slice, execute, isFunction} from "../../core.js";
import config from "../../config.js";
import {isNil}  from "../nil.js";
import {toArray} from "../../types/array/concrete.js";
import {opt} from "../../types/just/construct.js";
import {satisfies, specify}  from "../protocol.js";
import * as p from "./protocols.js";

function spread1(f){
  return function(args){
    return f(...toArray(args));
  }
}

function spread2(f, idx){
  return function(...args){
    const out = [];
    for(let i = 0; i < args.length; i++){
      const arg = args[i];
      if (i === idx){
        out.push(...arg);
      } else {
        out.push(arg);
      }
    }
    return f(...out);
  }
}

export const spread = overload(null, spread1, spread2);

export function parsedo(re, xf, callback){
  return opt(re, xf, spread(callback));
}

export function realize(g){
  return isFunction(g) ? g() : g;
}

export function realized(f){
  return function(...args){
    return apply(f, p.reduce(function(memo, arg){
      memo.push(realize(arg));
      return memo;
    }, [], args));
  }
}

export function juxt(...fs){
  return function(...args){
    return p.reduce(function(memo, f){
      return memo.concat([f.apply(this, args)]);
    }, [], fs);
  }
}

function apply2(f, args){
  return f.apply(null, toArray(args));
}

function apply3(f, a, args){
  return f.apply(null, [a, ...toArray(args)]);
}

function apply4(f, a, b, args){
  return f.apply(null, [a, b, ...toArray(args)]);
}

function apply5(f, a, b, c, args){
  return f.apply(null, [a, b, c, ...toArray(args)]);
}

function applyN(f, a, b, c, d, args){
  return f.apply(null, [a, b, c, d, ...toArray(args)]);
}

export const apply = overload(null, null, apply2, apply3, apply4, apply5, applyN);

export function flip(f){
  return function(b, a, ...args){
    return f.apply(this, [a, b, ...args]);
  }
}

export function farg(f, ...fs){
  return function(...args){
    for(let x = 0; x < args.length; x++){
      const g = fs[x];
      if (g) {
        args[x] = g(args[x]);
      }
    }
    return f(...args);
  }
}

export function fnil(f, ...substitutes){
  return function(...args){
    for(let x = 0; x < substitutes.length; x++){
      if (isNil(args[x])) {
        args[x] = substitutes[x]
      };
    }
    return f(...args);
  }
}
