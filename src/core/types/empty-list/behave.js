import {identity, constantly, does, marked} from '../../core';
import {implement} from '../protocol';
import {IEquiv, IBlankable, ICoerceable, IInclusive, IReversible, ICollection, INext, ISeq, ISeqable, ISequential, IAssociative, IIndexed, IEmptyableCollection, IKVReduce, IReduce, ICounted} from '../../protocols';
import {emptyList, EmptyList} from '../../types/empty-list/construct';
import {emptyArray} from '../../types/array/construct';
import {Symbol} from '../symbol/construct';

function reduce(self, f, init){
  return init;
}

function equiv(as, bs){
  const xs = ISeqable.seq(as),
        ys = ISeqable.seq(bs);
  return IEquiv.equiv(ISeq.first(xs), ISeq.first(ys)) && IEquiv.equiv(INext.next(xs), INext.next(ys));
}

export const behaveAsEmptyList = marked(does)(
  implement(IEquiv, {equiv}),
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