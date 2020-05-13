import {IFn, ISeq, IReduce, IKVReduce, ILookup, IInclusive, IAssociative, IEmptyableCollection} from "../../protocols";
import {apply, isFunction} from "../function";
import {reducing} from "../../protocols/ireduce/concrete";
import {overload, branch} from "../../core";
import {satisfies} from "../protocol/concrete";
import {empty} from "../../protocols/iemptyablecollection";

export function juxtVals(self, value){
  return IKVReduce.reducekv(self, function(memo, key, f){
    return IAssociative.assoc(memo, key, isFunction(f) ? f(value) : f);
  }, empty(self));
}

export function selectKeys(self, keys){
  return IReduce.reduce(keys, function(memo, key){
    return IAssociative.assoc(memo, key, ILookup.lookup(self, key));
  }, empty(self));
}

export function removeKeys(self, keys){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IInclusive.includes(keys, key) ? memo : IAssociative.assoc(memo, key, value);
  }, empty(self));
}

export function mapKeys(self, f){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, f(key), value);
  }, empty(self));
}

function mapVals2(self, f){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, key, f(value));
  }, empty(self));
}

function mapVals3(self, f, pred){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, key, pred(key) ? f(value) : value);
  }, empty(self));
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