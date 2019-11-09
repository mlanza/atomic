import {identity, constantly, does} from '../../core';
import {implement} from '../protocol';
import {IBlankable, ICoerce, IInclusive, IReversible, IEncode, ICollection, INext, ISeq, ISeqable, ISequential, IAssociative, IIndexed, IEmptyableCollection, IKVReduce, IReduce, ICounted} from '../../protocols';
import {emptyList} from '../../types/empty-list/construct';
import {emptyArray} from '../../types/array/construct';
import {Symbol} from '../symbol/construct';

function encode(self, label){
  return IAssociative.assoc({data: null}, label, self[Symbol.toStringTag]);
}

function reduce(self, f, init){
  return init;
}

export const behaveAsEmptyList = does(
  implement(ISequential),
  implement(IEncode, {encode}),
  implement(IBlankable, {blank: constantly(true)}),
  implement(IReversible, {reverse: emptyList}),
  implement(ICounted, {count: constantly(0)}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IInclusive, {includes: constantly(false)}),
  implement(IKVReduce, {reducekv: reduce}),
  implement(IReduce, {reduce}),
  implement(ICoerce, {toArray: emptyArray}),
  implement(ISeq, {first: constantly(null), rest: emptyList}),
  implement(INext, {next: constantly(null)}),
  implement(ISeqable, {seq: constantly(null)}));