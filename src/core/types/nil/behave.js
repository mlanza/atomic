import {IBlottable, ICompact, IFunctor, IMap, ILog, IAssociative, IInclusive, IOtherwise, IEncode, IDecode, IFork, IArray, IEquiv, ICollection, INext, ISeq, ISeqable, IIndexed, ICounted, ILookup, IReduce, IEmptyableCollection, ISequential} from '../../protocols';
import {emptyList} from '../../types/empty-list/construct';
import {identity, constantly, does, overload, noop} from '../../core';
import {implement} from '../protocol';
import {emptyArray} from '../../types/array/construct';
import Nil, {nil} from './construct';

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

export default does(
  implement(ILog, {log: noop}),
  implement(ICompact, {compact: identity}),
  implement(IBlottable, {blot: identity}),
  implement(IMap, {keys: nil, vals: nil, dissoc: nil}),
  implement(IEncode, {encode: identity}),
  implement(IDecode, {decode: identity}),
  implement(IFork, {fork}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IOtherwise, {otherwise}),
  implement(IEquiv, {equiv}),
  implement(IFunctor, {fmap: identity}),
  implement(ILookup, {lookup: identity}),
  implement(IInclusive, {includes: constantly(false)}),
  implement(IAssociative, {assoc: assoc, contains: constantly(false)}),
  implement(INext, {next: identity}),
  implement(IArray, {toArray: emptyArray}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: identity}),
  implement(IIndexed, {nth: identity}),
  implement(ICounted, {count: constantly(0)}),
  implement(IReduce, {reduce}));