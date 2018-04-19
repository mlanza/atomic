import {extendType} from '../../protocol';
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
import {showSeq, nextSeq, toArraySeq, reduceSeq} from '../../common';
import {seq} from '../../protocols/iseqable';
import {identity, constantly} from '../../core';
import {indexedSeq} from '../../types/indexedseq';
import {first, rest, toArray} from '../../protocols/iseq';

extendType(LazySeq, ISequential, {}, ISeq, {
  first: function(self){
    return self.head;
  },
  rest: function(self){
    return self.tail();
  },
  toArray: toArraySeq
}, IReduce, {
  _reduce: reduceSeq
}, ISeqable, {
  seq: identity
}, INext, {
  next: nextSeq
}, IShow, {
  show: function(self){
    return "#lazy-seq " + showSeq(self);
  }
});