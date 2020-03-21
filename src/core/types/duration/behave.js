import {implement} from '../protocol';
import {does, identity, partial} from '../../core';
import {IAddable, IKVReduce, IReduce, IFunctor, IMergeable, ICoerceable, IMultipliable, IDivisible, IMap, IAssociative, ILookup, IInclusive} from '../../protocols';
import {add} from '../../protocols/iaddable/concrete';
import {mergeWith} from '../../protocols/imergeable/instance';
import {Duration} from '../duration/construct';

function reducekv(self, xf, init){
  return IReduce.reduce(keys(self), function(memo, key){
    return xf(memo, key, ILookup.lookup(self, key));
  }, init);
}

const merge = partial(mergeWith, add);

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
  return new self.constructor(IMap.dissoc(self.units, key));
}

function lookup(self, key){
  if (!IInclusive.includes(Duration.units, key)){
    throw new Error("Invalid unit.");
  }
  return ILookup.lookup(self.units, key);
}

function contains(self, key){
  return IAssociative.contains(self.units, key);
}

function assoc(self, key, value){
  if (!IInclusive.includes(Duration.units, key)){
    throw new Error("Invalid unit.");
  }
  return new self.constructor(IAssociative.assoc(self.units, key, value));
}

function divide(a, b){
  return a.valueOf() / b.valueOf();
}

export const behaveAsDuration = does(
  implement(IKVReduce, {reducekv}),
  implement(IAddable, {add: merge}),
  implement(IMergeable, {merge}),
  implement(IFunctor, {fmap}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IMap, {keys, dissoc}),
  implement(IDivisible, {divide}),
  implement(IMultipliable, {mult}),
  implement(ICoerceable, {toDuration: identity}));