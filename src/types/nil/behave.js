import {IAssociative, IEquiv, ICollection, INext, IArr, ISeq, IShow, ISeqable, IIndexed, ICounted, ILookup, IReduce, IEmptyableCollection} from '../../protocols';
import {EMPTY} from '../../types/empty';
import {identity, constantly, effect} from '../../core';
import {implement, surrogates} from '../../protocol';
import {EMPTY_ARRAY} from '../../types/array/construct';
import {Nil} from './construct';

function nil(self){
  if (self == null) {
    return Nil;
  }
}

function assoc(self, key, value){
  let obj = {};
  obj[key] = value;
  return obj;
}

function reduce(self, xf, init){
  return init;
}

function equiv(self, other){
  return null == other;
}

surrogates.unshift(nil);

export default effect(
  implement(IEmptyableCollection, {empty: identity}),
  implement(IEquiv, {equiv}),
  implement(ILookup, {lookup: constantly(null)}),
  implement(IAssociative, {assoc: assoc, contains: constantly(false)}),
  implement(INext, {next: identity}),
  implement(IArr, {toArray: constantly(EMPTY_ARRAY)}),
  implement(ISeq, {first: identity, rest: constantly(EMPTY)}),
  implement(ISeqable, {seq: identity}),
  implement(IIndexed, {nth: identity}),
  implement(ICounted, {count: constantly(0)}),
  implement(IReduce, {reduce}),
  implement(IShow, {show: constantly("null")}));