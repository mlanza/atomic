import {does, identity} from "atomic/core";
import {implement} from "atomic/core";
import {emptyTransientSet, transientSet} from './construct';
import {filter, lazySeq} from "atomic/core";
import {cons} from "atomic/core";
import {emptyList} from "atomic/core";
import {apply} from "atomic/core";
import {unreduced} from "atomic/core";
import {ICoerce, ISeq, IReduce, ISeqable, ISet, INext, ISequential, ICounted, ICollection, IEmptyableCollection, IInclusive, ICloneable} from "atomic/core";
import {IPersistent, ITransientSet, ITransientEmptyableCollection, ITransientCollection} from "../../protocols";
import {_ as v} from "param.macro";

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

function seqVals1(iter){
  return seqVals2(iter, emptyList());
}

function seqVals2(iter, done){
  const res = iter.next();
  return res.done ? done : lazySeq(function(){
    return cons(res.value, seqVals1(iter));
  });
}

const seqVals = overload(null, seqVals1, seqVals2);

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

export const behaveAsTransientSet = does(
  implement(ISequential),
  implement(ITransientCollection, {conj}),
  implement(ITransientSet, {disj}), //TODO unite
  implement(IReduce, {reduce}),
  implement(ICoerce, {toArray}),
  implement(ISeqable, {seq}),
  implement(IInclusive, {includes}),
  implement(ICloneable, {clone}),
  implement(ITransientEmptyableCollection, {empty}),
  implement(ICounted, {count}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}))