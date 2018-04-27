import IIndexed from '../../protocols/iindexed';
import ISeq from '../../protocols/iseq';
import IShow from '../../protocols/ishow';
import ICounted from '../../protocols/icounted';
import ILookup from '../../protocols/ilookup';
import IFn from '../../protocols/ilookup';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import {constantly, doto, length, EMPTY_STRING} from "../../core";
import {nthIndexed} from "../../common";
import {implement} from '../../protocol';

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

doto(String,
  implement(IIndexed, {nth: nthIndexed}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_STRING)}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup: lookup}),
  implement(ISeq, {first: first, rest: rest, toArray: toArray}),
  implement(ICounted, {count: length}),
  implement(IShow, {show: show}));