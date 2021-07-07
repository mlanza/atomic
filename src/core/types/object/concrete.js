import {IFn, IMap, IIndexed, IReduce, IKVReduce, ILookup, IInclusive, IAssociative, IEmptyableCollection} from "../../protocols.js";
import {apply, isFunction} from "../function.js";
import {reducing} from "../../protocols/ireduce/concrete.js";
import {overload, branch} from "../../core.js";
import {satisfies} from "../protocol/concrete.js";
import {emptyObject} from "./construct.js";
import * as p from "./protocols.js";

//an entity is has descriptive key/value pairs whereas an array does not.
export function descriptive(self){
  return satisfies(ILookup, self) && satisfies(IMap, self) && !satisfies(IIndexed, self);
}

const emptied = branch(satisfies(IEmptyableCollection), p.empty, emptyObject);

export function juxtVals(self, value){
  return p.reducekv(function(memo, key, f){
    return p.assoc(memo, key, isFunction(f) ? f(value) : f);
  }, emptied(self), self);
}

export function selectKeys(self, keys){
  return p.reduce(function(memo, key){
    return p.assoc(memo, key, p.get(self, key));
  }, emptied(self), keys);
}

export function removeKeys(self, keys){
  return p.reducekv(function(memo, key, value){
    return p.includes(keys, key) ? memo : p.assoc(memo, key, value);
  }, emptied(self), self);
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
  return p.reducekv(self, p.assoc, defaults);
}

export const defaults = overload(null, null, defaults2, reducing(defaults2));

export function compile(self){
  return isFunction(self) ? self : function(...args){
    return apply(p.invoke, self, args);
  }
}
