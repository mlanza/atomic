import {overload, identity, partial, slice, isFunction} from "../../core.js";
import config from "../../config.js";
import {isNil}  from "../nil.js";
import {satisfies}  from "../protocol.js";
import * as p from "./protocols.js";

export function spread(f){
  return function(args){
    return f(...p.toArray(args));
  }
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
  return f.apply(null, p.toArray(args));
}

function apply3(f, a, args){
  return f.apply(null, [a].concat(p.toArray(args)));
}

function apply4(f, a, b, args){
  return f.apply(null, [a, b].concat(p.toArray(args)));
}

function apply5(f, a, b, c, args){
  return f.apply(null, [a, b, c].concat(p.toArray(args)));
}

function applyN(f, a, b, c, d, args){
  return f.apply(null, [a, b, c, d].concat(p.toArray(args)));
}

export const apply = overload(null, null, apply2, apply3, apply4, apply5, applyN);

export function multi(dispatch){
  return function(...args){
    const f = apply(dispatch, args);
    if (!f){
      throw Error("Failed dispatch");
    }
    return apply(f, args);
  }
}

export function tee(f){
  return function(value){
    f(value);
    return value;
  }
}

export function see(...args){
  return tee(function(obj){
    apply(p.log, config.logger, p.conj(args, obj));
  });
}

export function flip(f){
  return function(b, a, ...args){
    return f.apply(this, [a, b].concat(args));
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

