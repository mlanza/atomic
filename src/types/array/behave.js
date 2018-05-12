import {juxt, identity, constantly, reduce, reducekv, slice, length} from '../../core';
import {implement} from '../../protocol';
import {showSeq, nthIndexed} from '../../common';
import IReduce from '../../protocols/ireduce';
import IKVReduce from '../../protocols/ikvreduce';
import IAppendable from '../../protocols/iappendable';
import IPrependable from '../../protocols/iprependable';
import IInclusive from '../../protocols/iinclusive';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import IArr from '../../protocols/iarr';
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
import {EMPTY_ARRAY} from '../../types/array/construct';
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

function append(self, x){
  return self.concat([x]);
}

function prepend(self, x){
  return [x].concat(self);
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

function includes(self, x){
  return self.indexOf(x) > -1;
}

export default juxt(
  implement(ISequential),
  implement(IInclusive, {includes: includes}),
  implement(IAppendable, {append: append}),
  implement(IPrependable, {prepend: prepend}),
  implement(ICloneable, {clone: Array.from}),
  implement(IFn, {invoke: lookup}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_ARRAY)}),
  implement(IReduce, {_reduce: reduce}),
  implement(IKVReduce, {_reducekv: reducekv}),
  implement(ILookup, {lookup: lookup}),
  implement(IAssociative, {assoc: assoc,contains: contains}),
  implement(IIndexed, {nth: nthIndexed}),
  implement(ISeqable, {seq: seq}),
  implement(ICollection, {conj: append}),
  implement(INext, {next: next}),
  implement(IArr, {toArray: identity}),
  implement(ISeq, {first: first, rest: rest}),
  implement(ICounted, {count: length}),
  implement(IShow, {show: showSeq}));