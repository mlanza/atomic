import {does, kin} from "../../core.js";
import {implement} from "../protocol.js";
import {ICoerceable, IInverse, IAddable, ISequential, ICollection, IComparable, INext, IEquiv, IReduce, IKVReduce, ISeqable, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, ISeq, IInclusive, IIndexed} from "../../protocols.js";
import {unreduced, isReduced} from "../reduced.js";
import {drop} from "../lazy-seq.js";
import {iterable} from "../lazy-seq/behave.js";
import {emptyable} from "../record/behave.js";
import iemptylist from "../empty-list/behave.js";
import {Range} from "./construct.js";
import {directed} from "../../protocols/iaddable/concrete.js";
import {alike} from "../../protocols/iequiv/concrete.js";

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

const _equiv = implement(IEquiv, iemptylist).behavior.equiv;

function equiv(self, other){
  return kin(self, other) ? alike(self, other) : _equiv(self, other);
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

function reducekv(self, xf, init){
  let memo = init,
      coll = seq(self),
      n = 0;
  while(!isReduced(memo) && coll){
    memo = xf(memo, n++, ISeq.first(coll));
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

export default does(
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
  implement(IKVReduce, {reducekv}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IEquiv, {equiv}));