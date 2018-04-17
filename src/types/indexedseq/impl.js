import {identity} from '../../core';
import {extendType} from '../../protocol';
import {showSeq} from '../../common';
import IndexedSeq, {indexedSeq} from '../../types/indexedseq/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import ICounted from '../../protocols/icounted';
import IReduce from '../../protocols/ireduce';
import Reduced from '../../types/reduced';
import {first, rest, toArray} from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';

extendType(IndexedSeq, IReduce, {
  reduce: function(self, xf, init){
    return reduce(self.arr, xf, init, self.start);
  }
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