import {implement} from '../../protocol';
import IndexedSeq from '../../types/indexedseq';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import IArr from '../../protocols/iarr';
import ISeq from '../../protocols/iseq';
import IReduce from '../../protocols/ireduce';
import IKVReduce from '../../protocols/ikvreduce';
import ISeqable from '../../protocols/iseqable';
import ISequential from '../../protocols/isequential';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import {showSeq, nextSeq, toArraySeq, reduceSeq, reducekvSeq, iterable} from '../../common';
import {identity, constantly, juxt} from '../../core';

function first(self){
  return self.head;
}

function rest(self){
  return self.tail();
}

function show(self){
  return "#lazy-seq " + showSeq(self);
}

export default juxt(
  iterable,
  implement(ISequential),
  implement(IArr, {toArray: toArraySeq}),
  implement(ISeq, {first: first, rest: rest}),
  implement(IReduce, {_reduce: reduceSeq}),
  implement(IKVReduce, {_reducekv: reducekvSeq}),
  implement(ISeqable, {seq: identity}),
  implement(INext, {next: nextSeq}),
  implement(IShow, {show: show}));