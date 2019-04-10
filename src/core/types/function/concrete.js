import {ICoerce}  from "../../protocols/icoerce";
import {IReduce}  from "../../protocols/ireduce";
import {reduced} from "../../types/reduced/construct";
import {overload, identity, partial, log, slice} from "../../core";
import {isNil}  from "../nil";
import {satisfies}  from "../protocol";
import {isFunction}  from "./construct";
export {complement, partial, slice} from "../../core";

export function spread(f){
  return function(args){
    return f(...ICoerce.toArray(args));
  }
}

export function realize(g){
  return isFunction(g) ? g() : g;
}

export function realized(f){
  return function(...args){
    return apply(f, IReduce.reduce(args, function(memo, arg){
      memo.push(realize(arg));
      return memo;
    }, []));
  }
}

export function juxt(...fs){
  return function(...args){
    return IReduce.reduce(fs, function(memo, f){
      return memo.concat([f.apply(this, args)]);
    }, []);
  }
}

export function pipe(f, ...fs){
  return function(){
    return IReduce.reduce(fs, function(memo, f){
      return f(memo);
    }, f.apply(null, arguments));
  }
}

export function comp(...fs){
  const last = fs.length - 1, f = fs[last];
  return function(){
    return IReduce.reduce(fs, function(memo, f){
      return f(memo);
    }, f.apply(null, arguments), last - 1, 0);
  }
}

function apply2(f, args){
  return f.apply(null, ICoerce.toArray(args));
}

function apply3(f, a, args){
  return f.apply(null, [a].concat(ICoerce.toArray(args)));
}

function apply4(f, a, b, args){
  return f.apply(null, [a, b].concat(ICoerce.toArray(args)));
}

function apply5(f, a, b, c, args){
  return f.apply(null, [a, b, c].concat(ICoerce.toArray(args)));
}

function applyN(f, a, b, c, d, args){
  return f.apply(null, [a, b, c, d].concat(ICoerce.toArray(args)));
}

export const apply = overload(null, null, apply2, apply3, apply4, apply5, applyN);

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

export function see(about){
  return tee(partial(log, about));
}

export function flip(f){
  return function(b, a, ...args){
    return f.apply(this, [a, b].concat(args));
  }
}

function fnil(f, ...substitutes){
  return function(...args){
    for(var x = 0; x < args.length; x++){
      if (isNil(args[x])) { args[x] = substitutes[x] };
    }
    return f(...args);
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