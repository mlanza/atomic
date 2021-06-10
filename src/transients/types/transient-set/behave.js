import {does, identity, implement, overload, assoc, cons, filter, lazyIterable, emptyList, apply, unreduced, ICoerceable, ISeq, IReduce, ISeqable, ISet, INext, ISequential, ICounted, ICollection, IEmptyableCollection, IInclusive, ICloneable} from "atomic/core";
import {emptyTransientSet, transientSet} from "./construct.js";
import {IPersistent, ITransientSet, ITransientEmptyableCollection, ITransientCollection} from "../../protocols.js";

function seq(self){
  return count(self) ? self : null;
}

function empty(self){
  self.clear();
}

function disj(self, value){
  self.delete(value);
}

function includes(self, value){
  return self.has(value);
}

function conj(self, value){
  self.add(value);
}

function first(self){
  return self.values().next().value;
}

function rest(self){
  const iter = self.values();
  iter.next();
  return lazyIterable(iter);
}

function next(self){
  const iter = self.values();
  iter.next();
  return lazyIterable(iter, null);
}

function count(self){
  return self.size;
}

const toArray = Array.from;

function clone(self){
  return transientSet(toArray(self));
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

export const behaveAsTransientSet = does(
  implement(ISequential),
  implement(ITransientCollection, {conj}),
  implement(ITransientSet, {disj}), //TODO unite
  implement(IReduce, {reduce}),
  implement(ICoerceable, {toArray}),
  implement(ISeqable, {seq}),
  implement(IInclusive, {includes}),
  implement(ICloneable, {clone}),
  implement(ITransientEmptyableCollection, {empty}),
  implement(ICounted, {count}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}))