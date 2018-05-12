import IIndexed from '../../protocols/iindexed';
import ISeqable from '../../protocols/iseqable';
import ISeq from '../../protocols/iseq';
import IArr from '../../protocols/iarr';
import IInclusive from '../../protocols/iinclusive';
import IAppendable from '../../protocols/iappendable';
import IPrependable from '../../protocols/iprependable';
import IShow from '../../protocols/ishow';
import ICounted from '../../protocols/icounted';
import ILookup from '../../protocols/ilookup';
import IFn from '../../protocols/ilookup';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import {constantly, juxt, length} from "../../core";
import {nthIndexed} from "../../common";
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

export default juxt(
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