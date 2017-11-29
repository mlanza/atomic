import {identity, constantly} from '../../core';
import {extendType} from '../../protocol';
import {showSeq, nextSeq, toArraySeq} from '../../common';
import {indexedSeq} from '../../types/indexedseq';
import List from '../../types/list';
import IndexedSeq from '../../types/indexedseq';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import IShow from '../../protocols/ishow';
import {first, rest, toArray} from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';

extendType(List, INext, {
  next: nextSeq
}, ISeq, {
  first: function(self){
    return self.head;
  },
  rest: function(self){
    return self.tail;
  },
  toArray: toArraySeq
}, ISeqable, {
  seq: identity
}, IShow, {
  show: showSeq
});