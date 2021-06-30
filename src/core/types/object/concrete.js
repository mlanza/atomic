import {IFn, ISeq, IMap, IIndexed, IReduce, IKVReduce, ILookup, IInclusive, IAssociative, IEmptyableCollection} from "../../protocols.js";
import {apply, isFunction} from "../function.js";
import {reducing} from "../../protocols/ireduce/concrete.js";
import {overload, branch} from "../../core.js";
import {satisfies} from "../protocol/concrete.js";
import {empty} from "../../protocols/iemptyablecollection.js";
import {emptyObject} from "./construct.js";

//an entity is has descriptive key/value pairs whereas an array does not.
export function descriptive(self){
  return satisfies(ILookup, self) && satisfies(IMap, self) && !satisfies(IIndexed, self);
}

const emptied = branch(satisfies(IEmptyableCollection), empty, emptyObject);

export function juxtVals(self, value){
  return IKVReduce.reducekv(self, function(memo, key, f){
    return IAssociative.assoc(memo, key, isFunction(f) ? f(value) : f);
  }, emptied(self));
}

export function selectKeys(self, keys){
  return IReduce.reduce(keys, function(memo, key){
    return IAssociative.assoc(memo, key, ILookup.lookup(self, key));
  }, emptied(self));
}

export function removeKeys(self, keys){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IInclusive.includes(keys, key) ? memo : IAssociative.assoc(memo, key, value);
  }, emptied(self));
}

export function mapKeys(self, f){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, f(key), value);
  }, emptied(self));
}

function mapVals2(self, f){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, key, f(value));
  }, self);
}

function mapVals3(init, f, pred){
  return IReduce.reduce(IMap.keys(init), function(memo, key){
    return pred(key) ? IAssociative.assoc(memo, key, f(ILookup.lookup(memo, key))) : memo;
  }, init);
}

export const mapVals = overload(null, null, mapVals2, mapVals3);

function defaults2(self, defaults){
  return IKVReduce.reducekv(self, IAssociative.assoc, defaults);
}

export const defaults = overload(null, null, defaults2, reducing(defaults2));

export function compile(self){
  return isFunction(self) ? self : function(...args){
    return apply(IFn.invoke, self, args);
  }
}
