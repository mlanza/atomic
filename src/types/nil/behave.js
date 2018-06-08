import {IAssociative, IArray, IEquiv, ICollection, INext, ISeq, IShow, ISeqable, IIndexed, ICounted, ILookup, IReduce, IEmptyableCollection, ISequential} from '../../protocols';
import EmptyList from '../../types/emptylist';
import {identity, constantly, effect} from '../../core';
import {implement, surrogates} from '../protocol';
import Array from '../../types/array/construct';
import Nil from './construct';

function nil(self){
  if (self == null) {
    return Nil;
  }
}

function assoc(self, key, value){
  const obj = {};
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
  implement(ISequential),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IEquiv, {equiv}),
  implement(ILookup, {lookup: constantly(null)}),
  implement(IAssociative, {assoc: assoc, contains: constantly(false)}),
  implement(INext, {next: identity}),
  implement(IArray, {toArray: constantly(Array.EMPTY)}),
  implement(ISeq, {first: identity, rest: constantly(EmptyList.EMPTY)}),
  implement(ISeqable, {seq: identity}),
  implement(IIndexed, {nth: identity}),
  implement(ICounted, {count: constantly(0)}),
  implement(IReduce, {reduce}),
  implement(IShow, {show: constantly("null")}));