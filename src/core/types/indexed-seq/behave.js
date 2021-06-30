import {identity, does, overload} from "../../core.js";
import {implement} from "../protocol.js";
import {indexedSeq} from "./construct.js";
import {revSeq} from "../../types/rev-seq/construct.js";
import {isReduced, unreduced} from "../../types/reduced.js";
import {ICoerceable, IEquiv, IReversible, IMapEntry, IFind, IInclusive, IAssociative, IAppendable, IPrependable, ICollection, INext, ICounted, IReduce, IKVReduce, ISeq, ISeqable, ISequential, IIndexed, ILookup, IFn, IEmptyableCollection} from "../../protocols.js";
import {concat} from "../../types/concatenated/construct.js";
import {iterable} from "../lazy-seq/behave.js";
import {drop, detect} from "../lazy-seq/concrete.js";
import {emptyArray} from "../../types/array/construct.js";
import iemptylist from "../../types/empty-list/behave.js";

function reverse(self){
  let c = ICounted.count(self);
  return c > 0 ? revSeq(self, c - 1) : null;
}

function key(self){
  return lookup(self, 0);
}

function val(self){
  return lookup(self, 1);
}

function find(self, key){
  return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
}

function contains(self, key){
  return key < ICounted.count(self.seq) - self.start;
}

function lookup(self, key){
  return ILookup.lookup(self.seq, self.start + key);
}

function append(self, x){
  return concat(self, [x]);
}

function prepend(self, x){
  return concat([x], self);
}

function next(self){
  const pos = self.start + 1;
  return pos < ICounted.count(self.seq) ? indexedSeq(self.seq, pos) : null;
}

function nth(self, idx){
  return IIndexed.nth(self.seq, idx + self.start);
}

function idx2(self, x){
  return idx3(self, x, 0);
}

function idx3(self, x, idx){
  if (first(self) === x) {
    return idx;
  }
  const nxt = next(self);
  return nxt ? idx3(nxt, x, idx + 1) : null;
}

const idx = overload(null, null, idx2, idx3);

function first(self){
  return nth(self, 0);
}

function rest(self){
  return indexedSeq(self.seq, self.start + 1);
}

function toArray(self){
  return reduce(self, function(memo, x){
    memo.push(x);
    return memo;
  }, []);
}

function count(self){
  return ICounted.count(self.seq) - self.start;
}

function reduce(self, xf, init){
  let memo = init,
      coll = ISeqable.seq(self);
  while (coll && !isReduced(memo)){
    memo = xf(memo, ISeq.first(coll));
    coll = INext.next(coll);
  }
  return unreduced(memo);
}

function reducekv(self, xf, init){
  let idx = 0;
  return reduce(self, function(memo, value){
    memo = xf(memo, idx, value);
    idx += 1;
    return memo;
  }, init);
}

function includes(self, x){
  return detect(IEquiv.equiv(x, ?), drop(self.start, self.seq));
}

export default does(
  iterable,
  implement(IEquiv, iemptylist),
  implement(ISequential),
  implement(IIndexed, {nth, idx}),
  implement(IReversible, {reverse}),
  implement(IMapEntry, {key, val}),
  implement(IInclusive, {includes}),
  implement(IFind, {find}),
  implement(IAssociative, {contains}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty: emptyArray}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup}),
  implement(ICollection, {conj: append}),
  implement(INext, {next}),
  implement(ICoerceable, {toArray}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count}));
