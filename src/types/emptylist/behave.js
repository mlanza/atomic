import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {IArray, ICollection, INext, ISeq, ISeqable, ISequential, IIndexed, IShow, IEmptyableCollection, IReduce, ICounted} from '../../protocols';
import EmptyList from '../../types/emptylist/construct';
import Array from '../../types/array/construct';

export default effect(
  implement(ISequential),
  implement(ICounted, {count: constantly(0)}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IReduce, {reduce: identity}),
  implement(IArray, {toArray: constantly(Array.EMPTY)}),
  implement(ISeq, {first: constantly(null), rest: constantly(EmptyList.EMPTY)}),
  implement(INext, {next: constantly(null)}),
  implement(ISeqable, {seq: constantly(null)}),
  implement(IShow, {show: constantly("[]")}));