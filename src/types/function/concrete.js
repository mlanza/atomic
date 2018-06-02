import {IArray}  from "../../protocols/iarray";
import {log, overload, identity, constantly} from "../../core";
import {isNil}  from "../nil";
import {slice}  from "../array/concrete";
import {reduce, reduced}  from "../reduced";
import {isFunction}  from "./construct";
export {complement, partial} from "../../core";

export function realize(g){
  return isFunction(g) ? g() : g;
}

export function realized(f){
  return function(...args){
    return apply(f, reduce(args, function(memo, arg){
      memo.push(realize(arg));
      return memo;
    }, []));
  }
}

export function juxt(...fs){
  return function(...args){
    return reduce(fs, function(memo, f){
      return memo.concat([f.apply(this, args)]);
    }, []);
  }
}

export function comp(...fs){
  var last = fs.length - 1, init = fs[last];
  return function(...args){
    return reduce(fs, function(memo, f){
      return f(memo);
    }, init.apply(null, args), last - 1, 0);
  }
}

function apply2(f, args){
  return f.apply(null, IArray.toArray(args));
}

function apply3(f, a, args){
  return f.apply(null, [a].concat(IArray.toArray(args)));
}

function apply4(f, a, b, args){
  return f.apply(null, [a, b].concat(IArray.toArray(args)));
}

function apply5(f, a, b, c, args){
  return f.apply(null, [a, b, c].concat(IArray.toArray(args)));
}

function applyN(f, a, b, c, d, args){
  return f.apply(null, [a, b, c, d].concat(IArray.toArray(args)));
}

export const apply = overload(null, null, apply2, apply3, apply4, apply5, applyN);

export function partially(f){
  return function(...args){
    return apply(partial, f, args);
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

export function multi(dispatch){
  return function(...args){
    const f = apply(dispatch, args);
    if (!f){
      throw Error("Failed dispatch");
    }
    return apply(f, args);
  }
}

export function tap(f){
  return function(value){
    f(value);
    return value;
  }
}

export function see(about){
  return tap(partial(log, about));
}

export function flip(f){
  return function(...args){
    return f.apply(this, args.reverse());
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

export function constructs(Type) {
  return function(...args){
    return new (Function.prototype.bind.apply(Type, [null].concat(args)));
  }
}

export function exec(f, ...args){ //for use with pointfree/subj
  return f.apply(this, args);
}
