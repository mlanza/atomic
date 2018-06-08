import {IArray, IIndexed, ISeqable, INext, ISeq, IInclusive, IAppendable, IPrependable, IShow, ICounted, ILookup, IFn, IComparable, IEmptyableCollection} from '../../protocols';
import {constantly, effect} from "../../core";
import {implement} from '../protocol';
import String from './construct';
import EmptyList from '../emptylist/construct';
import {lazySeq} from '../lazyseq/construct';
import {indexed} from '../array/behave';

function compare(self, other){
  return self === other ? 0 : self > other ? 1 : -1;
}

function seq2(self, idx){
  return idx < self.length ? lazySeq(self[idx], function(){
    return seq2(self, idx + 1);
  }) : String.EMPTY;
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

function show(self){
  return "\"" + self + "\"";
}

function append(self, tail){
  return self + tail;
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

export default effect(
  indexed,
  implement(IArray, {toArray}),
  implement(IComparable, {compare}),
  implement(IInclusive, {includes}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty: constantly(String.EMPTY)}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup}),
  implement(ISeqable, {seq}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}),
  implement(IShow, {show}));