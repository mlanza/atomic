import {IFn, ISeq, IReduce, IKVReduce, ILookup, IAssociative, IEmptyableCollection, IDescriptive} from "../../protocols";
import {apply, isFunction} from "../function";
import {reducing} from "../../protocols/ireduce/concrete";
import {overload, branch} from "../../core";
import {satisfies} from "../protocol/concrete";
import {emptyObject} from "./construct";

const emptied = branch(satisfies(IEmptyableCollection), IEmptyableCollection.empty, emptyObject);

export function mapKeysWith(self, value){
  return satisfies(IDescriptive, self) ? IKVReduce.reducekv(self, function(memo, key, f){
    return IAssociative.assoc(memo, key, isFunction(f) ? f(value) : mapKeysWith(f, value));
  }, emptied(self)) : self;
}

export function selectKeys(self, keys){
  return IReduce.reduce(keys, function(memo, key){
    return IAssociative.assoc(memo, key, ILookup.lookup(self, key));
  }, emptied(self));
}

export function mapSomeKeys(self, f, pred){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, key, pred(key) ? f(value) : value);
  }, emptied(self));
}

export function mapSomeVals(self, f, pred){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, key, pred(value) ? f(value) : value);
  }, emptied(self));
}

export function mapKeys(self, f){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, f(key), value);
  }, emptied(self));
}

export function mapVals(self, f){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, key, f(value));
  }, emptied(self));
}

function defaults2(self, defaults){
  return IKVReduce.reducekv(self, IAssociative.assoc, defaults);
}

export const defaults = overload(null, null, defaults2, reducing(defaults2));

export function compile(self){
  return isFunction(self) ? self : function(...args){
    return apply(IFn.invoke, self, args);
  }
}