import {identity, constantly, reduce, doto, EMPTY_ARRAY} from '../../core';
import {implement} from '../../protocol';
import {showSeq} from '../../common';
import IndexedSeq, {indexedSeq} from '../../types/indexedseq/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ICounted from '../../protocols/icounted';
import IReduce from '../../protocols/ireduce';
import Reduced from '../../types/reduced';
import ISeq from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import ISequential from '../../protocols/isequential';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import ILookup from '../../protocols/ilookup';
import IFn from '../../protocols/ifn';
import IEmptyableCollection from '../../protocols/iemptyablecollection';

function lookup(self, key){
  return self.arr[self.start + key];
}

function _reduce(self, xf, init){
  return reduce(self.arr, xf, init, self.start);
}

function conj(self, x){
  return toArray(self).concat([x]);
}

function next(self){
  var pos = self.start + 1;
  return pos < self.arr.length ? indexedSeq(self.arr, pos) : null;
}

function first(self){
  return self.arr[self.start];
}

function rest(self){
  return indexedSeq(self.arr, self.start + 1);
}

function toArray(self){
  return self.arr.slice(self.start);
}

function count(self){
  return self.length - self.start;
}

function show(self){
  return "#indexed-seq " + showSeq(self);
}

doto(IndexedSeq,
  implement(ISequential),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_ARRAY)}),
  implement(IReduce, {reduce: _reduce}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup: lookup}),
  implement(ICollection, {conj: conj}),
  implement(INext, {next: next}),
  implement(ISeq, {first: first, rest: rest, toArray: toArray}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count: count}),
  implement(IShow, {show: show}));