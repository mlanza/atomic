import {IIndexed, ISeqable, ISeq, IArr, IInclusive, IAppendable, IPrependable, IShow, ICounted, ILookup, IFn, IEmptyableCollection} from '../../protocols';
import {constantly, effect} from "../../core";
import {nthIndexed, length} from "../../common";
import {implement} from '../../protocol';
import {EMPTY_STRING} from '../../types/string/construct';

function seq(self){
  return self.length ? self : null;
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
  implement(IIndexed, {nth: nthIndexed}),
  implement(IInclusive, {includes: includes}),
  implement(IAppendable, {append: append}),
  implement(IPrependable, {prepend: prepend}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_STRING)}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup: lookup}),
  implement(IArr, {toArray: toArray}),
  implement(ISeqable, {seq: seq}),
  implement(ISeq, {first: first, rest: rest}),
  implement(ICounted, {count: length}),
  implement(IShow, {show: show}));