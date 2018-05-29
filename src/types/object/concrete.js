import {invoke} from "../../protocols/ifn";
import {reduce} from "../../protocols/ireduce";
import {lookup} from "../../protocols/ilookup";
import {assoc} from "../../protocols/iassociative";
import {reducing} from "../../types/reduced";
import {apply} from "../../types/function";
import {overload, constantly} from "../../core";

function selectKeys3(self, keys, init){
  return reduce(keys, function(memo, key){
    return assoc(memo, key, lookup(self, key));
  }, init);
}

function selectKeys2(self, keys){
  return selectKeys3(self, keys, {});
}

export const selectKeys = overload(null, null, selectKeys2, selectKeys3);

function defaults2(self, defaults){
  return Object.assign({}, defaults, self);
}

export const defaults = overload(null, null, defaults2, reducing(defaults2));

export function compile(self){
  return function(...args){
    return apply(invoke, self, args);
  }
}
