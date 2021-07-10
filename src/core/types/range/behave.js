import {does, kin} from "../../core.js";
import {implement} from "../protocol.js";
import {ICoercible, IInverse, ISequential, INext, IEquiv, IReduce, IKVReduce, ISeqable, ICounted, ISeq, IInclusive, IIndexed} from "../../protocols.js";
import {unreduced, isReduced} from "../reduced.js";
import {drop} from "../lazy-seq.js";
import {iterable} from "../lazy-seq/behave.js";
import {emptyable} from "../record/behave.js";
import {equiv as _equiv} from "../empty-list/behave.js";
import {Range} from "./construct.js";
import * as p from "./protocols.js";

function seq(self){
  return p.equiv(self.start, self.end) || (self.step == null && self.direction == null && self.start == null && self.end == null) ? null : self;
}

function first(self){
  return self.end == null ? self.start : p.compare(self.start, self.end) * self.direction < 0 ? self.start : null;
}

function rest(self){
  return p.next(self) || new self.constructor(self.end, self.end, self.step, self.direction);
}

function next(self){
  if (!seq(self)) return null;
  const stepped = p.add(self.start, self.step);
  return self.end == null || (p.compare(stepped, self.end) * self.direction) < 0 ? new self.constructor(stepped, self.end, self.step, self.direction) : null;
}

function equiv(self, other){
  return kin(self, other) ? p.alike(self, other) : _equiv(self, other);
}

function reduce(self, xf, init){
  let memo = init,
      coll = seq(self);
  while(!isReduced(memo) && coll){
    memo = xf(memo, p.first(coll));
    coll = p.next(coll);
  }
  return unreduced(memo);
}

function reducekv(self, xf, init){
  let memo = init,
      coll = seq(self),
      n = 0;
  while(!isReduced(memo) && coll){
    memo = xf(memo, n++, p.first(coll));
    coll = p.next(coll);
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
        step  = p.inverse(self.step);
  return new self.constructor(start, end, step, p.directed(start, step));
}

function nth(self, idx){
  return p.first(drop(idx, self));
}

function count(self){
  let n  = 0,
      xs = self;
  while (p.seq(xs)) {
    n++;
    xs = p.rest(xs);
  }
  return n;
}

function includes(self, value){
  let xs = self;
  if (self.direction > 0) {
    while (p.seq(xs)) {
      let c = p.compare(p.first(xs), value);
      if (c === 0)
        return true;
      if (c > 0)
        break;
      xs = p.rest(xs);
    }
  } else {
    while (p.seq(xs)) {
      let c = p.compare(p.first(xs), value);
      if (c === 0)
        return true;
      if (c < 0)
        break;
      xs = p.rest(xs);
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
  implement(ICoercible, {toArray}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IEquiv, {equiv}));
