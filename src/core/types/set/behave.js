import {does, identity, constantly} from '../../core';
import {implement} from '../protocol';
import {Set, emptySet} from './construct';
import {transientSet} from "../transient-set/construct";
import {unreduced} from '../../types/reduced/concrete';
import {IArray, ITransient, ISeq, IReduce, ISeqable, ISet, INext, ISequential, ICounted, ICollection, IEmptyableCollection, IInclusive, ICloneable} from '../../protocols';

function transient(self){
  return transientSet(toArray(self));
}

function seq(self){
  return count(self) ? self : null;
}

function union(self, other){
  return Set.union([self, other]);
}

function intersection(self, other){
  return Set.intersect([self, other]);
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
  implement(IArray, {toArray}),
  implement(ISeqable, {seq}),
  implement(IInclusive, {includes}),
  implement(ISet, {union, intersection}),
  implement(ICloneable, {clone: identity}),
  implement(IEmptyableCollection, {empty: emptySet}),
  implement(ICollection, {conj}),
  implement(ICounted, {count}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}))