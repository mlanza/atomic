import {does} from "../../core.js";
import {implement} from "../protocol.js";
import {ICoercible, IInversive, ISequential, IEquiv, IReducible, IKVReducible, ISeqable, ICounted, ISeq, IInclusive, IIndexed} from "../../protocols.js";
import {drop} from "../lazy-seq.js";
import {iterable} from "../lazy-seq/behave.js";
import {emptyable} from "../record/behave.js";
import {equiv as _equiv} from "../empty-list/behave.js";
import {Range} from "./construct.js";
import * as p from "./protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {reduce, reducekv} from "../../shared.js";

function seq(self){
  return p.equiv(self.start, self.end) || (self.step == null && self.direction == null && self.start == null && self.end == null) ? null : self;
}

function first(self){
  return self.end == null ? self.start : p.compare(self.start, self.end) * self.direction < 0 ? self.start : null;
}

function rest(self){
  if (!seq(self)) return null;
  const stepped = p.add(self.start, self.step);
  return self.end == null || (p.compare(stepped, self.end) * self.direction) < 0 ? new self.constructor(stepped, self.end, self.step, self.direction) : null;
}

function equiv(self, other){
  return p.kin(self, other) ? p.alike(self, other) : _equiv(self, other);
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
  keying("Range"),
  implement(ISequential),
  implement(IInversive, {inverse}),
  implement(IIndexed, {nth}),
  implement(ICounted, {count}),
  implement(IInclusive, {includes}),
  implement(ISeqable, {seq}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(ISeq, {first, rest}),
  implement(IEquiv, {equiv}));
