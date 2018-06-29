import {IFn, IReduce, IKVReduce, ILookup, IAssociative, IEmptyableCollection} from "../../protocols";
import {apply} from "../function";
import {reducing} from "../../api/reduce";
import {overload, constantly} from "../../core";

export function juxtVals(self, template){
  return IKVReduce.reducekv(template, function(memo, key, f){
    return IAssociative.assoc(memo, key, f(self));
  }, IEmptyableCollection.empty(template));
}

export function selectKeys(self, keys){
  return IReduce.reduce(keys, function(memo, key){
    return IAssociative.assoc(memo, key, ILookup.lookup(self, key));
  }, IEmptyableCollection.empty(self));
}

function mapSomeKeys4(init, self, f, pred){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, key, pred(key) ? f(value) : value);
  }, init);
}

function mapSomeKeys3(self, f, pred){
  return mapSomeVals4(IEmptyableCollection.empty(self), self, f, pred);
}

export const mapSomeKeys = overload(null, null, null, mapSomeKeys3, mapSomeKeys4);

function mapSomeVals4(init, self, f, pred){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, key, pred(value) ? f(value) : value);
  }, init);
}

function mapSomeVals3(self, f, pred){
  return mapSomeVals4(IEmptyableCollection.empty(self), self, f, pred);
}

export const mapSomeVals = overload(null, null, null, mapSomeVals3, mapSomeVals4);


function mapKeys3(init, self, f){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, f(key), value);
  }, IEmptyableCollection.empty(self));
}

function mapKeys2(self, f){
  return mapKeys3(IEmptyableCollection.empty(self), self, f);
}

export const mapKeys = overload(null, null, mapKeys2, mapKeys3);

function mapVals3(init, self, f){
  return IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, key, f(value));
  }, init);
}

function mapVals2(self, f){
  return mapVals3(IEmptyableCollection.empty(self), self, f);
}

export const mapVals = overload(null, null, mapVals2, mapVals3);

function defaults2(self, defaults){
  return IKVReduce.reducekv(self, IAssociative.assoc, defaults);
}

export const defaults = overload(null, null, defaults2, reducing(defaults2));

export function compile(self){
  return function(...args){
    return apply(IFn.invoke, self, args);
  }
}
