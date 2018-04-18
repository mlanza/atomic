import {identity, constantly} from '../../core';
import {extendType} from '../../protocol';
import {showSeq, nextSeq, toArraySeq} from '../../common';
import IndexedSeq, {indexedSeq} from '../../types/indexedseq/construct';
import List from '../../types/list/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import IShow from '../../protocols/ishow';
import {first, rest, toArray} from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import {EMPTY} from '../../types/empty';

extendType(List, IEmptyableCollection, {
  empty: EMPTY
}, INext, {
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
  show: function(self){
    return "#list " + showSeq(self);
  }
});