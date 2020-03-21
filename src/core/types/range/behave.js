import {does} from '../../core';
import {implement} from '../protocol';
import {ICoerceable, IInverse, IAddable, ISequential, ICollection, IComparable, INext, IEquiv, IReduce, IKVReduce, ISeqable, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, ISeq, IInclusive, IIndexed} from '../../protocols';
import {unreduced, isReduced} from '../reduced';
import {drop} from '../lazy-seq';
import {iterable} from '../lazy-seq/behave';
import {emptyable} from "../record/behave";
import {directed} from '../../protocols/iaddable/concrete';

function seq(self){
  return IEquiv.equiv(self.start, self.end) || (self.step == null && self.direction == null && self.start == null && self.end == null) ? null : self;
}

function first(self){
  return self.end == null ? self.start : IComparable.compare(self.start, self.end) * self.direction < 0 ? self.start : null;
}

function rest(self){
  return INext.next(self) || new self.constructor(self.end, self.end, self.step, self.direction);
}

function next(self){
  if (!seq(self)) return null;
  const stepped = IAddable.add(self.start, self.step);
  return self.end == null || (IComparable.compare(stepped, self.end) * self.direction) < 0 ? new self.constructor(stepped, self.end, self.step, self.direction) : null;
}

function equiv(self, other){
  return other != null && IEquiv.equiv(self.start, other.start) && IEquiv.equiv(self.end, other.end) && IEquiv.equiv(self.step, other.step);
}

function reduce(self, xf, init){
  let memo = init,
      coll = seq(self);
  while(!isReduced(memo) && coll){
    memo = xf(memo, ISeq.first(coll));
    coll = INext.next(coll);
  }
  return unreduced(memo);
}

function toArray(self){
  return reduce(self, function(memo, date){
    memo.push(date);
    return memo;
  }, []);
}

function inverse(self){
  const start = self.end,
        end   = self.start,
        step  = IInverse.inverse(self.step);
  return new self.constructor(start, end, step, directed(start, step));
}

function nth(self, idx){
  return ISeq.first(drop(idx, self));
}

function count(self){
  let n  = 0,
      xs = self;
  while (ISeqable.seq(xs)) {
    n++;
    xs = ISeq.rest(xs);
  }
  return n;
}

function includes(self, value){
  let xs = self;
  if (self.direction > 0) {
    while (ISeqable.seq(xs)) {
      let c = IComparable.compare(ISeq.first(xs), value);
      if (c === 0)
        return true;
      if (c > 0)
        break;
      xs = ISeq.rest(xs);
    }
  } else {
    while (ISeqable.seq(xs)) {
      let c = IComparable.compare(ISeq.first(xs), value);
      if (c === 0)
        return true;
      if (c < 0)
        break;
      xs = ISeq.rest(xs);
    }
  }
  return false;
}

export const behaveAsRange = does(
  iterable,
  emptyable,
  implement(ISequential),
  implement(IInverse, {inverse}),
  implement(IIndexed, {nth}),
  implement(ICounted, {count}),
  implement(IInclusive, {includes}),
  implement(ISeqable, {seq}),
  implement(ICoerceable, {toArray}),
  implement(IReduce, {reduce}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IEquiv, {equiv}));