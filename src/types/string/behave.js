import {IElementContent, IIndexed, ISeqable, ISeq, IArr, IInclusive, IAppendable, IPrependable, IShow, ICounted, ILookup, IFn, IEmptyableCollection} from '../../protocols';
import {constantly, effect} from "../../core";
import {implement} from '../../protocol';
import {EMPTY_STRING} from './construct';
import {indexed} from '../array/behave';

function appendTo(self, parent){
  parent.appendChild(document.createTextNode(self));
}

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
  indexed,
  implement(IElementContent, {appendTo}),
  implement(IInclusive, {includes}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_STRING)}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup: lookup}),
  implement(IArr, {toArray}),
  implement(ISeqable, {seq}),
  implement(ISeq, {first, rest}),
  implement(IShow, {show}));