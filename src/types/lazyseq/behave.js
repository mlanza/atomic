import {implement} from '../../protocol';
import {ICollection, INext, IArr, ISeq, IReduce, IKVReduce, ISeqable, ISequential, IIndexed, IShow} from '../../protocols';
import {showSeq, nextSeq, toArraySeq, reduceSeq, reducekvSeq, iterable} from '../../common';
import {identity, constantly, effect} from '../../core';

function first(self){
  return self.head;
}

function rest(self){
  return self.tail();
}

function show(self){
  return "#lazy-seq " + showSeq(self);
}

export default effect(
  iterable,
  implement(ISequential),
  implement(IArr, {toArray: toArraySeq}),
  implement(ISeq, {first: first, rest: rest}),
  implement(IReduce, {_reduce: reduceSeq}),
  implement(IKVReduce, {_reducekv: reducekvSeq}),
  implement(ISeqable, {seq: identity}),
  implement(INext, {next: nextSeq}),
  implement(IShow, {show: show}));