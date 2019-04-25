import {IBlankable, ICompact, IMap, IAssociative, IInclusive, IOtherwise, IEncode, IDecode, IFork, ICoerce, IEquiv, ICollection, INext, ISeq, ISeqable, IIndexed, ICounted, ILookup, IReduce, IEmptyableCollection, ISequential} from '../../protocols';
import {emptyList} from '../../types/empty-list/construct';
import {cons} from '../../types/list/construct';
import {identity, constantly, does, overload, noop} from '../../core';
import {implement} from '../protocol';
import {emptyArray} from '../../types/array/construct';
import {nil} from './construct';

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

function fork(self, reject, resolve){
  return reject(self);
}

function conj(self, value){
  return cons(value);
}

export default does(
  implement(ICompact, {compact: identity}),
  implement(ICollection, {conj}),
  implement(IBlankable, {blank: constantly(true)}),
  implement(IMap, {keys: nil, vals: nil, dissoc: nil}),
  implement(IEncode, {encode: identity}),
  implement(IDecode, {decode: identity}),
  implement(IFork, {fork}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IOtherwise, {otherwise}),
  implement(IEquiv, {equiv}),
  implement(ILookup, {lookup: identity}),
  implement(IInclusive, {includes: constantly(false)}),
  implement(IAssociative, {assoc: assoc, contains: constantly(false)}),
  implement(INext, {next: identity}),
  implement(ICoerce, {toArray: emptyArray}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: identity}),
  implement(IIndexed, {nth: identity}),
  implement(ICounted, {count: constantly(0)}),
  implement(IReduce, {reduce}));