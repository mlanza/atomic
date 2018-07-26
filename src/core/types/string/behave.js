import {IArray, IReduce, ICollection, IHash, IEncode, IDecode, IIndexed, ISeqable, INext, ISeq, IInclusive, IAppendable, IPrependable, ICounted, ILookup, IFn, IComparable, IEmptyableCollection} from '../../protocols';
import {effect, identity} from "../../core";
import {implement} from '../protocol';
import {isReduced, unreduced} from '../reduced';
import {lazySeq} from '../lazy-seq/construct';
import {iindexed} from '../array/behave';
import {emptyString} from "./construct";

function compare(self, other){
  return self === other ? 0 : self > other ? 1 : -1;
}

function conj(self, other){
  return self + other;
}

function seq2(self, idx){
  return idx < self.length ? lazySeq(self[idx], function(){
    return seq2(self, idx + 1);
  }) : "";
}

function seq(self){
  return seq2(self, 0);
}

function lookup(self, key){
  return self[key];
}

export function replace(s, match, replacement){
  return s.replace(match, replacement);
}

export function subs(s, start, end){
  return s.substring(start, end);
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

function toArray(self){
  return self.split('');
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

function hash(self){
  let hash = 0;
  for (let i = 0; i < self.length; i++) {
    hash += Math.pow(self.charCodeAt(i) * 31, self.length - i);
    hash = hash & hash;
  }
  return hash;
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

export default effect(
  iindexed,
  implement(IHash, {hash}),
  implement(ICollection, {conj}),
  implement(IReduce, {reduce}),
  implement(IEncode, {encode: identity}),
  implement(IDecode, {decode: identity}),
  implement(IArray, {toArray}),
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