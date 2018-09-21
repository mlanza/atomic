import {does, identity} from '../../core';
import {implement} from '../protocol';
import {emptyTransientSet, transientSet} from './construct';
import {filter, lazySeq} from '../lazy-seq';
import {emptyList} from '../empty-list/construct';
import {apply} from "../function/concrete";
import {unreduced} from '../reduced/concrete';
import {IArray, IPersistent, ISeq, IReduce, ISeqable, ISet, INext, ISequential, ICounted, ICollection, IEmptyableCollection, IInclusive, ICloneable} from '../../protocols';
import {_ as v} from "param.macro";

function seq(self){
  return count(self) ? self : null;
}

function disj(self, value){
  return self.delete(value);
}

function includes(self, value){
  return self.has(value);
}

function conj(self, value){
  return self.add(value);
}

function first(self){
  return self.values().next().value;
}

function seqVals1(iter){
  return seqVals2(iter, emptyList());
}

function seqVals2(iter, done){
  const res = iter.next();
  return res.done ? done : lazySeq(res.value, function(){
    return seqVals1(iter);
  });
}

function rest(self){
  const iter = self.values();
  iter.next();
  return seqVals(iter);
}

function next(self){
  const iter = self.values();
  iter.next();
  return seqVals(iter, null);
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

export default does(
  implement(ISequential),
  implement(IReduce, {reduce}),
  implement(IArray, {toArray}),
  implement(ISeqable, {seq}),
  implement(IInclusive, {includes}),
  implement(ISet, {disj, unite: conj}),
  implement(ICloneable, {clone}),
  implement(IEmptyableCollection, {empty: emptyTransientSet}),
  implement(ICollection, {conj}),
  implement(ICounted, {count}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}))