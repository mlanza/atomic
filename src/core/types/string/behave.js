import {IBlankable, ITemplate, IKVReduce, IAssociative, ICompact, ICoerce, IMatch, IReduce, ICollection, IIndexed, ISeqable, INext, ISeq, IInclusive, IAppendable, IPrependable, ICounted, ILookup, IFn, IComparable, IEmptyableCollection} from '../../protocols';
import {does, identity, constantly} from "../../core";
import {implement, specify} from '../protocol';
import {isReduced, unreduced} from '../reduced';
import {lazySeq} from '../lazy-seq/construct';
import {cons} from '../list/construct';
import {iindexed} from '../array/behave';
import {rePattern} from '../reg-exp/concrete';
import {emptyString, isString} from "./construct";
import {replace} from "./concrete";

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
  implement(ICompact, {compact}),
  implement(IBlankable, {blank}),
  implement(ITemplate, {fill}),
  implement(IMatch, {matches}),
  implement(ICollection, {conj}),
  implement(IReduce, {reduce}),
  implement(ICoerce, {toArray}),
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