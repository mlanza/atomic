import {IBlankable, ISplittable, ITemplate, IKVReduce, IAssociative, ICompactable, ICoerceable, IMatchable, IReduce, ICollection, IIndexed, ISeqable, INext, ISeq, IInclusive, IAppendable, IPrependable, ICounted, ILookup, IFn, IComparable, IEmptyableCollection} from "../../protocols.js";
import {does, identity, constantly, unbind, overload} from "../../core.js";
import {implement} from "../protocol.js";
import {isReduced, unreduced} from "../reduced.js";
import {lazySeq} from "../lazy-seq/construct.js";
import {cons} from "../list/construct.js";
import {iindexed} from "../array/behave.js";
import {rePattern} from "../reg-exp/concrete.js";
import {emptyString, isString} from "./construct.js";
import {replace} from "./concrete.js";

function split1(str){
  return str.split("");
}

function split3(str, pattern, n){
  const parts = [];
  while(str && n !== 0){
    let found = str.match(pattern);
    if (!found || n < 2) {
      parts.push(str);
      break;
    }
    let pos  = str.indexOf(found),
        part = str.substring(0, pos);
    parts.push(part);
    str = str.substring(pos + found.length);
    n = n ? n - 1 : n;
  }
  return parts;
}

const split = overload(null, split1, unbind(String.prototype.split), split3)

function fill(self, params){
  return IKVReduce.reducekv(params, function(text, key, value){
    return replace(text, new RegExp("\\{" + key + "\\}", 'ig'), value);
  }, self);
}

function blank(self){
  return self.trim().length === 0;
}

function compact(self){
  return self.trim();
}

function compare(self, other){
  return self === other ? 0 : self > other ? 1 : -1;
}

function conj(self, other){
  return self + other;
}

function seq2(self, idx){
  return idx < self.length ? lazySeq(function(){
    return cons(self[idx], seq2(self, idx + 1));
  }) : null;
}

function seq(self){
  return seq2(self, 0);
}

function lookup(self, key){
  return self[key];
}

function first(self){
  return self[0] || null;
}

function rest(self){
  return next(self) || "";
}

function next(self){
  return self.substring(1) || null;
}

function prepend(self, head){
  return head + self;
}

function includes(self, str){
  return self.indexOf(str) > -1;
}

function toArray(self){
  return self.split("");
}

function reduce(self, xf, init){
  let memo = init;
  let coll = ISeqable.seq(self);
  while(coll && !isReduced(memo)){
    memo = xf(memo, ISeq.first(coll));
    coll = INext.next(coll);
  }
  return unreduced(memo);
}

function matches(self, re){
  return rePattern(re).test(self);
}

export const behaveAsString = does(
  iindexed,
  implement(ISplittable, {split}),
  implement(ICompactable, {compact}),
  implement(IBlankable, {blank}),
  implement(ITemplate, {fill}),
  implement(IMatchable, {matches}),
  implement(ICollection, {conj}),
  implement(IReduce, {reduce}),
  implement(ICoerceable, {toArray}),
  implement(IComparable, {compare}),
  implement(IInclusive, {includes}),
  implement(IAppendable, {append: conj}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty: emptyString}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup}),
  implement(ISeqable, {seq}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}));