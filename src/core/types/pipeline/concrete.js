/*
* Monads, like promises, once introduced force themselves everywhere.  Pipelines allow one to dip into monadic operations without commiting to them.
*/

import {log, overload, identity, doto} from "../../core";
import {pipeline} from "./construct";
import {partial, apply, comp} from "../function/concrete";
import {compile} from "../object/concrete";
import {isNil} from "../nil/construct";
import {cons} from "../list/construct";
import {isBlank} from "../string/concrete";
import {transduce} from "../lazyseq/concrete";
import {mapcat, distinct, compact} from "../lazyseq/concrete";
import {reduced} from "../reduced";
import EmptyList from "../emptylist";
import * as t from "../../../transducers";
import {update} from "../../api/associative";
import {ISeqable} from "../../protocols/iseqable";
import {isSequential} from "../../protocols/isequential";

export function trap(f){
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
    return mapcat(function(x){
      const result = apply(f, x, args);
      if (isSequential(result) || result == null) {
        if (ISeqable.seq(result)) {
          return result;
        } else {
          return EmptyList.EMPTY;
        }
      } else {
        return [result];
      }
    }, xs);
  }
}

export function compacted(f){
  return comp(compact, f);
}

export function unique(f){
  return comp(distinct, f);
}

export function selfish(f){
  const g = multiple(f);
  return function(x, ...args){
    return cons(x, g(x, ...args));
  }
}

export const elements = comp(unique, compacted, multiple);

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
export const many   = chained(multiple);
export const els    = chained(elements);
export const pipe   = piped(identity);
export const opt    = piped(option);
export const prom   = piped(future);
export const handle = piped(trap);

export const request = pipeline(future, [function(config){
  return fetch(config.url, config);
}]);