import {IIndexed, ISeqable, ISeq, IInclusive, IAppendable, IPrependable, IShow, ICounted, ILookup, IFn, IEmptyableCollection} from '../../protocols';
import {constantly, effect} from "../../core";
import {implement} from '../protocol';
import {EMPTY_STRING} from './construct';
import {EMPTY} from '../empty/construct';
import {lazySeq} from '../lazyseq/construct';
import {indexed} from '../array/behave';

function seq2(self, idx){
  return idx < self.length ? lazySeq(self[idx], function(){
    return seq2(self, idx + 1);
  }) : EMPTY;
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
  return self[0];
}

function rest(self){
  return self.substring(1);
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

export default effect(
  indexed,
  implement(IInclusive, {includes}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_STRING)}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup}),
  implement(ISeqable, {seq}),
  implement(ISeq, {first, rest}),
  implement(IShow, {show}));