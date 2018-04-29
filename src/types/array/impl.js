import {identity, constantly, reduce, slice, doto, length, EMPTY_ARRAY} from '../../core';
import {implement} from '../../protocol';
import {showSeq, nthIndexed} from '../../common';
import IReduce from '../../protocols/ireduce';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IAssociative from '../../protocols/iassociative';
import ISequential from '../../protocols/isequential';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import IShow from '../../protocols/ishow';
import IFn from '../../protocols/ifn';
import ICounted from '../../protocols/icounted';
import ILookup from '../../protocols/ilookup';
import ICloneable from '../../protocols/icloneable';
import Reduced from '../../types/reduced';
import {indexedSeq} from '../../types/indexedseq';

function lookup(self, key){
  return self[key];
}

function assoc(self, key, value){
  var arr = slice(self);
  arr.splice(key, 1, value);
  return arr;
}

function contains(self, key){
  return key > -1 && key < self.length;
}

function seq(self){
  return self.length ? self : null;
}

function conj(self, x){
  return self.concat([x]);
}

function next(self){
  return self.length > 1 ? ISeq.rest(self) : null;
}

function first(self){
  return self[0] || null;
}

function rest(self){
  return indexedSeq(self, 1);
}

doto(Array,
  implement(ISequential),
  implement(ICloneable, {clone: slice}),
  implement(IFn, {invoke: lookup}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_ARRAY)}),
  implement(IReduce, {_reduce: reduce}),
  implement(ILookup, {lookup: lookup}),
  implement(IAssociative, {assoc: assoc,contains: contains}),
  implement(IIndexed, {nth: nthIndexed}),
  implement(ISeqable, {seq: seq}),
  implement(ICollection, {conj: conj}),
  implement(INext, {next: next}),
  implement(ISeq, {first: first, rest: rest, toArray: identity}),
  implement(ICounted, {count: length}),
  implement(IShow, {show: showSeq}));