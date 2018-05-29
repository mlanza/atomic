import {IFn, IReduce, ILookup, IAssociative} from "../../protocols";
import {reducing} from "../reduced";
import {apply} from "../function";
import {overload, constantly} from "../../core";

function selectKeys3(self, keys, init){
  return IReduce.reduce(keys, function(memo, key){
    return IAssociative.assoc(memo, key, ILookup.lookup(self, key));
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
    return apply(IFn.invoke, self, args);
  }
}
