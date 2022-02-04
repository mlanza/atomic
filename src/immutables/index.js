import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import * as T from "immutable";
import {map} from "./types/map/construct.js";
export * from "./types.js";

function memoize2(f, hash){
  const c = Symbol("cache");
  return function(self){
    const cache  = self[c] || map(),
          key    = hash.apply(self, arguments),
          result = _.contains(cache, key) ? _.get(cache, key) : f.apply(self, arguments);
    self[c] = _.assoc(cache, key, result);
    return result;
  }
}

function memoize1(f){
  return memoize2(f, function(self, ...args){
    return args;
  });
}

export const memoize = _.overload(null, memoize1, memoize2);

function toArray(self){
  return self.toArray();
}

_.ICoercible.addMethod([T.Map, Array], toArray);
_.ICoercible.addMethod([T.OrderedMap, Array], toArray);
_.ICoercible.addMethod([T.Set, Array], toArray);
_.ICoercible.addMethod([T.List, Array], toArray);
