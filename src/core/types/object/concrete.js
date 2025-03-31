import {IFn, IMap, IIndexed, IReducible, IKVReducible, ILookup, IInclusive, IAssociative, IEmptyableCollection} from "../../protocols.js";
import {apply} from "../function.js";
import {reducing} from "../../protocols/ireducible/concrete.js";
import {reduced} from "../../types/reduced/construct.js";
import {overload, branch, isFunction} from "../../core.js";
import {satisfies} from "../protocol/concrete.js";
import {emptyObject} from "./construct.js";
import {coerce} from "../../coerce.js";
import * as p from "./protocols.js";
import {is} from "../../protocols/imapentry/concrete.js";

export const toObject = coerce(?, Object);

export function isObject(self){
  return is(self, Object);
}

//an entity is has descriptive key/value pairs whereas an array does not.
export function descriptive(self){
  return satisfies(ILookup, self) && satisfies(IMap, self) && !satisfies(IIndexed, self);
}

export function where(self, other){
  return p.reduce(function(memo, [key, value]){
    return memo ? p.contains(self, key, value) : reduced(memo);
  }, true, other);
}

const emptied = branch(satisfies(IEmptyableCollection), p.empty, emptyObject);

export function juxtVals(self, value){
  return p.reducekv(function(memo, key, f){
    return p.assoc(memo, key, isFunction(f) ? f(value) : f);
  }, emptied(self), self);
}

export function evolve(template, obj){ //see ramda
  return template ? p.reducekv(function(memo, key, value){
    const f = p.get(template, key);
    return p.assoc(memo, key, isFunction(f) ? f(value) : f != null ? evolve(f, value) : value);
  }, emptied(obj), obj) : obj;
}

export function selectKeys(self, keys){
  return p.reduce(function(memo, key){
    return p.assoc(memo, key, p.get(self, key));
  }, emptied(self), keys);
}

export function removeKeys(self, keys){
  return p.dissoc(self, ...keys);
}

export function mapKeys(self, f){
  return p.reducekv(function(memo, key, value){
    return p.assoc(memo, f(key), value);
  }, emptied(self), self);
}

function mapVals2(self, f){
  return p.reducekv(function(memo, key, value){
    return p.assoc(memo, key, f(value));
  }, self, self);
}

function mapVals3(init, f, pred){
  return p.reduce(function(memo, key){
    return pred(key) ? p.assoc(memo, key, f(p.get(memo, key))) : memo;
  }, init, p.keys(init));
}

export const mapVals = overload(null, null, mapVals2, mapVals3);

function defaults2(self, defaults){
  return p.reducekv(p.assoc, defaults, self);
}

export const defaults = overload(null, null, defaults2, reducing(defaults2));

export function toFunction(self){
  return isFunction(self) ? self : function(...args){
    return apply(p.invoke, self, args);
  }
}
