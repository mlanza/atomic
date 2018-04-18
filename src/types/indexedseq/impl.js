import {identity, constantly, reduce, EMPTY_ARRAY} from '../../core';
import {extendType} from '../../protocol';
import {showSeq} from '../../common';
import IndexedSeq, {indexedSeq} from '../../types/indexedseq/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ICounted from '../../protocols/icounted';
import IReduce from '../../protocols/ireduce';
import Reduced from '../../types/reduced';
import ISeq, {first, rest, toArray} from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import ILookup from '../../protocols/ilookup';
import IFn from '../../protocols/ifn';
import IEmptyableCollection from '../../protocols/iemptyablecollection';

function lookup(self, key){
  return self.arr[self.start + key];
}

extendType(IndexedSeq, IEmptyableCollection, {
  empty: constantly(EMPTY_ARRAY)
}, IReduce, {
  _reduce: function(self, xf, init){
    return reduce(self.arr, xf, init, self.start);
  }
}, IFn, {
  invoke: lookup
}, ILookup, {
  lookup: lookup
}, ICollection,{
  conj: function(self, x){
    return toArray(self).concat([x]);
  }
}, INext, {
  next: function(self){
    var pos = self.start + 1;
    return pos < self.arr.length ? indexedSeq(self.arr, pos) : null;
  }
}, ISeq, {
  first: function(self){
    return self.arr[self.start];
  },
  rest: function(self){
    return indexedSeq(self.arr, self.start + 1);
  },
  toArray: function(self){
    return self.arr.slice(self.start);
  }
}, ISeqable, {
  seq: identity
}, ICounted, {
  count: function(self){
    return self.length - self.start;
  }
}, IShow, {
  show: function(self){
    return "#indexed-seq " + showSeq(self);
  }
});