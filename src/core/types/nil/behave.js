import {IFunctor, IAssociative, IOtherwise, IEncode, IDecode, IFold, IArray, IEquiv, ICollection, INext, ISeq, ISeqable, IIndexed, ICounted, ILookup, IReduce, IEmptyableCollection, ISequential} from '../../protocols';
import EmptyList from '../../types/empty-list/construct';
import {identity, constantly, effect, overload} from '../../core';
import {implement} from '../protocol';
import Array from '../../types/array/construct';
import Nil from './construct';

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

function otherwise(self, other){
  return other;
}

function fold(self, missing, okay){
  return missing(self);
}

export default effect(
  implement(ISequential),
  implement(IEncode, {encode: identity}),
  implement(IDecode, {decode: identity}),
  implement(IFold, {fold}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IOtherwise, {otherwise}),
  implement(IEquiv, {equiv}),
  implement(IFunctor, {fmap: identity}),
  implement(ILookup, {lookup: identity}),
  implement(IAssociative, {assoc: assoc, contains: constantly(false)}),
  implement(INext, {next: identity}),
  implement(IArray, {toArray: constantly(Array.EMPTY)}),
  implement(ISeq, {first: identity, rest: constantly(EmptyList.EMPTY)}),
  implement(ISeqable, {seq: identity}),
  implement(IIndexed, {nth: identity}),
  implement(ICounted, {count: constantly(0)}),
  implement(IReduce, {reduce}));