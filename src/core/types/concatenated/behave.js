import {identity, does} from "../../core.js";
import {implement} from "../protocol.js";
import {isReduced, unreduced} from "../reduced.js";
import {ICoerceable, ICollection, INext, ISeq, ICounted, ISeqable, IIndexed, IReduce, IKVReduce, ISequential, IEmptyableCollection} from "../../protocols.js";
import {apply} from "../function/concrete.js";
import {EmptyList, emptyList} from "../empty-list.js";
import ilazyseq, {iterable} from "../lazy-seq/behave.js";
import {mapa} from "../lazy-seq/concrete.js";
import {LazySeq} from "../lazy-seq/construct.js";
import {concatenated, concat} from "./construct.js";

function conj(self, x){
  return new self.constructor(ICollection.conj(self.colls, [x]));
}

function next(self){
  const tail = ISeq.rest(self);
  return ISeqable.seq(tail) ? tail : null;
}

function first(self){
  return ISeq.first(ISeq.first(self.colls));
}

function rest(self){
  return apply(concat, ISeq.rest(ISeq.first(self.colls)), ISeq.rest(self.colls));
}

function toArray(self){
  return reduce(self, function(memo, value){
    memo.push(value);
    return memo;
  }, []);
}

function reduce(self, xf, init){
  let memo = init,
      remaining = self;
  while(!isReduced(memo) && ISeqable.seq(remaining)){
    memo = xf(memo, ISeq.first(remaining))
    remaining = INext.next(remaining);
  }
  return unreduced(memo);
}

function reducekv(self, xf, init){
  let memo = init,
      remaining = self,
      idx = 0;
  while(!isReduced(memo) && ISeqable.seq(remaining)){
    memo = xf(memo, idx, ISeq.first(remaining))
    remaining = INext.next(remaining);
    idx++;
  }
  return unreduced(memo);
}

function count(self){
  return reduce(self, function(memo, value){
    return memo + 1;
  }, 0);
}

export default does(
  iterable,
  implement(IReduce, ilazyseq),
  implement(IKVReduce, ilazyseq),
  implement(ISequential),
  implement(IEmptyableCollection, {empty: emptyList}),
  implement(IKVReduce, {reducekv}), //TODO!!
  implement(IReduce, {reduce}), //TODO!!
  implement(ICollection, {conj}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(ICoerceable, {toArray}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count}));