import {implement} from '../protocol';
import {does, identity} from '../../core';
import {IKVReduce, IReduce, IFunctor, IMergeable, ICoerceable, IMultipliable, IDivisible, IMap, IAssociative, ILookup, IInclusive} from '../../protocols';
import {add} from '../../protocols/iaddable/concrete';
import {Duration, duration} from '../duration/construct';
import {mergeWith} from '../../associatives';

function reducekv(self, xf, init){
  return IReduce.reduce(keys(self), function(memo, key){
    return xf(memo, key, ILookup.lookup(self, key));
  }, init);
}

function merge(self, other){
  return other ? duration(mergeWith(add, self.units, other.units)) : self;
}

function mult(self, n){
  return IFunctor.fmap(self, function(value){
    return value * n;
  });
}

function fmap(self, f){
  return new self.constructor(IKVReduce.reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, key, f(value));
  }, {}));
}

function keys(self){
  return IMap.keys(self.units);
}

function dissoc(self, key){
  return duration(IMap.dissoc(self.units, key));
}

function lookup(self, key){
  if (!IInclusive.includes(Duration.units, key)){
    throw new Error("Invalid unit.");
  }
  return ILookup.lookup(self.units, key);
}

function assoc(self, key, value){
  if (!IInclusive.includes(Duration.units, key)){
    throw new Error("Invalid unit.");
  }
  return duration(IAssociative.assoc(self.units, key, value));
}

function divide(a, b){
  return a.valueOf() / b.valueOf();
}

export const behaveAsDuration = does(
  implement(IKVReduce, {reducekv}),
  implement(IMergeable, {merge}),
  implement(IFunctor, {fmap}),
  implement(IAssociative, {assoc}),
  implement(ILookup, {lookup}),
  implement(IMap, {keys, dissoc}),
  implement(IDivisible, {divide}),
  implement(IMultipliable, {mult}),
  implement(ICoerceable, {toDuration: identity}));