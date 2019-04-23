import {does} from '../../core';
import {implement} from '../protocol';
import {ICoerce, IBounds, IInverse, IEncode, ISteppable, ISequential, ICollection, IComparable, INext, IEquiv, IReduce, IKVReduce, ISeqable, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, ISeq, IInclusive, IIndexed} from '../../protocols';
import {between} from '../../protocols/ibounds/concrete';
import {unreduced, isReduced} from '../reduced';
import {drop} from '../lazy-seq';
import {comp} from '../function';
import {iterable} from '../lazy-seq/behave';
import {encodeable, emptyable} from "../record/behave";
import {emptyRange} from "./construct";

function seq(self){
  return IEquiv.equiv(self.start, self.end) || (self.step == null && self.direction == null && self.start == null && self.end == null) ? null : self;
}

function start(self){
  return self.start;
}

function end(self){
  return self.end;
}

function first(self){
  return IComparable.compare(self.start, self.end) * self.direction < 0 ? self.start : null;
}

function rest(self){
  return next(self) || emptyRange();
}

function next(self){
  if (!seq(self)) return null;
  const stepped = ISteppable.step(self.step, self.start);
  return (IComparable.compare(stepped, self.end) * self.direction) < 0 ? new self.constructor(stepped, self.end, self.step, self.direction) : null;
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
  return self.constructor.create(self.end, self.start, IInverse.inverse(self.step));
}

function nth(self, idx){
  return first(drop(idx, self));
}

function count(self){
  var n  = 0,
      xs = self;
  while (ISeqable.seq(xs)) {
    n++;
    xs = ISeq.rest(xs);
  }
  return n;
}

export default does(
  iterable,
  emptyable,
  encodeable,
  implement(ISequential),
  implement(IInverse, {inverse}),
  implement(IIndexed, {nth}),
  implement(ICounted, {count}),
  implement(IInclusive, {includes: between}),
  implement(ISeqable, {seq}),
  implement(IBounds, {start, end}),
  implement(ICoerce, {toArray}),
  implement(IReduce, {reduce}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IEquiv, {equiv}));