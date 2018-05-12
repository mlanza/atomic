import {identity, constantly, juxt} from '../../core';
import {implement} from '../../protocol';
import {showSeq, nextSeq, toArraySeq, reduceSeq} from '../../common';
import IndexedSeq, {indexedSeq} from '../../types/indexedseq/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import IShow from '../../protocols/ishow';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IReduce from '../../protocols/ireduce';
import ISequential from '../../protocols/isequential';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
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

export default juxt(
  implement(ISequential),
  implement(IReduce, {_reduce: reduceSeq}),
  implement(IEmptyableCollection, {empty: EMPTY}),
  implement(INext, {next: nextSeq}),
  implement(ISeq, {first: first, rest: rest, toArray: toArraySeq}),
  implement(ISeqable, {seq: identity}),
  implement(IShow, {show: show}));