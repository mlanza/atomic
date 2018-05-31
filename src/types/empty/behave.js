import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {EMPTY} from '../../types/empty/construct';
import {ICollection, INext, ISeq, IArr, ISeqable, ISequential, IIndexed, IShow, IEmptyableCollection, IReduce} from '../../protocols';
import {EMPTY_ARRAY} from '../../types/array/construct';

export default effect(
  implement(ISequential),
  implement(IEmptyableCollection, {empty: identity}),
  implement(IReduce, {reduce: identity}),
  implement(IArr, {toArray: constantly(EMPTY_ARRAY)}),
  implement(ISeq, {first: constantly(null), rest: constantly(EMPTY)}),
  implement(INext, {next: constantly(null)}),
  implement(ISeqable, {seq: constantly(null)}),
  implement(IShow, {show: constantly("[]")}));