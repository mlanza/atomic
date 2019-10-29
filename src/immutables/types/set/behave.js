import {
  does,
  identity,
  implement,
  unreduced,
  ICoerce,
  ISeq,
  IReduce,
  ISeqable,
  ISet,
  INext,
  ISequential,
  ICounted,
  ICollection,
  IEmptyableCollection,
  IInclusive,
  ICloneable
} from 'atomic/core';
import {
  ITransient,
  transientSet
} from 'atomic/transients';

import {emptySet} from "./construct";

function transient(self){
  return transientSet(toArray(self));
}

function seq(self){
  return count(self) ? self : null;
}

function toArray(self){
  return self.toArray();
}

function includes(self, value){
  return self.has(value);
}

function conj(self, value){
  return self.add(value);
}

function disj(self, value){
  return self.delete(value);
}

function first(self){
  return self.first();
}

function rest(self){
  let tail = self.rest();
  return tail.size > 0 ? tail : emptySet();
}

function next(self){
  let tail = self.rest();
  return tail.size > 0 ? tail : null;
}

function count(self){
  return self.size;
}

function reduce(self, xf, init){
  let memo = init;
  let coll = seq(self);
  while(coll){
    memo = xf(memo, first(coll));
    coll = next(coll);
  }
  return unreduced(memo);
}

export default does(
  implement(ISequential),
  implement(ITransient, {transient}),
  implement(IReduce, {reduce}),
  implement(ICoerce, {toArray}),
  implement(ISeqable, {seq}),
  implement(IInclusive, {includes}),
  implement(ISet, {disj, unite: conj}),
  implement(ICloneable, {clone: identity}),
  implement(IEmptyableCollection, {empty: emptySet}),
  implement(ICollection, {conj}),
  implement(ICounted, {count}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}))