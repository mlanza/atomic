import {identity} from '../../core';
import {extendType} from '../../protocol';
import {showSeq} from '../../common';
import {indexedSeq} from '../../types/indexedseq';
import IndexedSeq from '../../types/indexedseq';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import {first, rest, toArray} from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';

extendType(IndexedSeq, ICollection,{
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
}, IShow, {
  show: showSeq
});