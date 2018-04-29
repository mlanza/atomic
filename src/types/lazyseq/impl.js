import {implement} from '../../protocol';
import LazySeq from '../../types/lazyseq/construct';
import IndexedSeq from '../../types/indexedseq';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import IReduce from '../../protocols/ireduce';
import ISeqable from '../../protocols/iseqable';
import ISequential from '../../protocols/isequential';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import {showSeq, nextSeq, toArraySeq, reduceSeq, iterable} from '../../common';
import {identity, constantly, doto} from '../../core';

function first(self){
  return self.head;
}

function rest(self){
  return self.tail();
}

function show(self){
  return "#lazy-seq " + showSeq(self);
}

doto(LazySeq,
  iterable,
  implement(ISequential),
  implement(ISeq, {first: first, rest: rest, toArray: toArraySeq}),
  implement(IReduce, {_reduce: reduceSeq}),
  implement(ISeqable, {seq: identity}),
  implement(INext, {next: nextSeq}),
  implement(IShow, {show: show}));