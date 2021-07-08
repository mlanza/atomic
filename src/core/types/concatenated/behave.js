import {identity, does} from "../../core.js";
import {implement} from "../protocol.js";
import {isReduced, unreduced} from "../reduced.js";
import {apply} from "../function/concrete.js";
import {EmptyList, emptyList} from "../empty-list.js";
import ilazyseq, {iterable} from "../lazy-seq/behave.js";
import {mapa} from "../lazy-seq/concrete.js";
import {LazySeq} from "../lazy-seq/construct.js";
import {concatenated, concat} from "./construct.js";
import {ICoercible, ICollection, INext, ISeq, ICounted, ISeqable, IIndexed, IReduce, IKVReduce, ISequential, IEmptyableCollection} from "../../protocols.js";
import * as p from "./protocols.js";

function conj(self, x){
  return new self.constructor(p.conj(self.colls, [x]));
}

function next(self){
  const tail = p.rest(self);
  return p.seq(tail) ? tail : null;
}

function first(self){
  return p.first(p.first(self.colls));
}

function rest(self){
  return apply(concat, p.rest(p.first(self.colls)), p.rest(self.colls));
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
  while(!isReduced(memo) && p.seq(remaining)){
    memo = xf(memo, p.first(remaining))
    remaining = p.next(remaining);
  }
  return unreduced(memo);
}

function reducekv(self, xf, init){
  let memo = init,
      remaining = self,
      idx = 0;
  while(!isReduced(memo) && p.seq(remaining)){
    memo = xf(memo, idx, p.first(remaining))
    remaining = p.next(remaining);
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
  implement(ICoercible, {toArray}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count}));
