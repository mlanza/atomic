import {identity, constantly, effect} from '../../core';
import {implement} from '../../protocol';
import {showSeq, nextSeq, toArraySeq, reduceSeq} from '../../common';
import {ICollection, INext, IArr, ISeq, IShow, ISeqable, IIndexed, IReduce, ISequential, IEmptyableCollection} from '../../protocols';
import {EMPTY} from '../../types/empty';

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

function show(self){
  return "#list " + showSeq(self);
}

export default effect(
  implement(ISequential),
  implement(IReduce, {_reduce: reduceSeq}),
  implement(IEmptyableCollection, {empty: EMPTY}),
  implement(INext, {next: nextSeq}),
  implement(IArr, {toArray: toArraySeq}),
  implement(ISeq, {first: first, rest: rest}),
  implement(ISeqable, {seq: identity}),
  implement(IShow, {show: show}));