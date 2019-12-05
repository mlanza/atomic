import {identity, constantly, does} from '../../core';
import {implement} from '../protocol';
import {IBlankable, ICoerceable, IInclusive, IReversible, ICollection, INext, ISeq, ISeqable, ISequential, IAssociative, IIndexed, IEmptyableCollection, IKVReduce, IReduce, ICounted} from '../../protocols';
import {emptyList, EmptyList} from '../../types/empty-list/construct';
import {emptyArray} from '../../types/array/construct';
import {Symbol} from '../symbol/construct';

function reduce(self, f, init){
  return init;
}

export const behaveAsEmptyList = does(
  implement(ISequential),
  implement(IBlankable, {blank: constantly(true)}),
  implement(IReversible, {reverse: emptyList}),
  implement(ICounted, {count: constantly(0)}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IInclusive, {includes: constantly(false)}),
  implement(IKVReduce, {reducekv: reduce}),
  implement(IReduce, {reduce}),
  implement(ICoerceable, {toArray: emptyArray}),
  implement(ISeq, {first: constantly(null), rest: emptyList}),
  implement(INext, {next: constantly(null)}),
  implement(ISeqable, {seq: constantly(null)}));