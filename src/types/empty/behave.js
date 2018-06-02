import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {EMPTY} from '../../types/empty/construct';
import {IArray, ICollection, INext, ISeq, ISeqable, ISequential, IIndexed, IShow, IEmptyableCollection, IReduce, ICounted} from '../../protocols';
import {EMPTY_ARRAY} from '../../types/array/construct';

export default effect(
  implement(ISequential),
  implement(ICounted, {count: constantly(0)}),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IReduce, {reduce: identity}),
  implement(IArray, {toArray: constantly(EMPTY_ARRAY)}),
  implement(ISeq, {first: constantly(null), rest: constantly(EMPTY)}),
  implement(INext, {next: constantly(null)}),
  implement(ISeqable, {seq: constantly(null)}),
  implement(IShow, {show: constantly("[]")}));