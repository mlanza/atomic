import {identity, does} from "../../core.js";
import {implement} from "../protocol.js";
import {isReduced, unreduced} from "../reduced.js";
import {apply} from "../function/concrete.js";
import {EmptyList, emptyList} from "../empty-list.js";
import ilazyseq, {iterable, reductive} from "../lazy-seq/behave.js";
import {mapa, concat} from "../lazy-seq/concrete.js";
import {LazySeq} from "../lazy-seq/construct.js";
import {IHashable, ICoercible, ICollection, INext, ISeq, ICounted, ISeqable, IIndexed, IReducible, IKVReducible, ISequential, IEmptyableCollection} from "../../protocols.js";
import * as p from "./protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {hashSeq as hash} from "../../protocols/ihashable/hashers.js";

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

function reduce(self, f, init){
  let memo = init,
      remaining = self;
  while(!isReduced(memo) && p.seq(remaining)){
    memo = f(memo, p.first(remaining))
    remaining = p.next(remaining);
  }
  return unreduced(memo);
}

function reducekv(self, f, init){
  let memo = init,
      remaining = self,
      idx = 0;
  while(!isReduced(memo) && p.seq(remaining)){
    memo = f(memo, idx, p.first(remaining))
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
  //TODO reductive?
  keying("Concatenated"),
  implement(IKVReducible, {reducekv}),
  implement(IReducible, {reduce}),
  implement(IHashable, {hash}),
  implement(ISequential),
  implement(IEmptyableCollection, {empty: emptyList}),
  implement(ICollection, {conj}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count}));
