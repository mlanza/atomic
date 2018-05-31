/*
* Monads, like promises, once introduced force themselves everywhere.  Pipelines allow one to dip into monadic operations without commiting to them.
*/

import {log, overload, identity, doto} from "../../core";
import {pipeline} from "./construct";
import {partial, apply, comp} from "../function/concrete";
import {compile} from "../object/concrete";
import {isNil} from "../nil/construct";
import {isBlank} from "../string/concrete";
import {transduce} from "../lazyseq/concrete";
import {mapcat, distinct, compact} from "../lazyseq/concrete";
import {reduced} from "../reduced";
import {EMPTY} from "../empty";
import * as t from "../../transducers";
import {update} from "../../associatives";
import {isSequential, ISeqable} from "../../protocols";

export function either(f){
  return function(...args){
    try {
    return f(...args);
    } catch (ex) {
    return reduced(ex);
    }
  }
}

export function option(f){
  return function(x, ...args){
    return isNil(x) || isBlank(x) ? reduced(null) : apply(f, x, args);
  }
}

export function future(f){
  return overload(null, function(x){
    return Promise.resolve(x).then(f);
  }, function(...args){
    return Promise.resolve(f(...args));
  });
}

export function logged(f){
  return function(...args){
    var result = f(...args);
    log({f, args, result});
    return result;
  }
}

export function multiple(f){
  return function(x, ...args){
    const xs = isSequential(x) ? ISeqable.seq(x) : [x];
    return compact(mapcat(function(x){
      const result = apply(f, x, args);
      return isSequential(result) ? ISeqable.seq(result) ? result : [] : [result];
    }, xs));
  }
}

export function unique(f){
  return function(xs, ...args){
    return distinct(f(xs, ...args));
  }
}

function chainedN(how, init, ...fs){
  return transduce(t.map(how), function(memo, f){
    return f(memo);
  }, how(identity)(init), fs);
}

export const chained = overload(null, function(how){
  return partial(chainedN, how);
}, chainedN);

function pipedN(how, f, ...fs){
  return function(...args){
    return f ? chainedN(how, f(...args), ...fs) : args[0];
  }
}

export const piped = overload(null, function(how){
  return partial(pipedN, how);
}, pipedN);

export const chain  = chained(identity);
export const maybe  = chained(option);
export const many   = chained(comp(unique, multiple));
export const pipe   = piped(identity);
export const opt    = piped(option);
export const prom   = piped(future);
export const handle = piped(either);

export const request = pipeline(future, [function(config){
  return fetch(config.url, config);
}]);