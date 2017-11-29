import {identity, reduce} from '../../core';
import {extendType} from '../../protocol';
import {showSeq, nthIndexed} from '../../common';
import IReduce from '../../protocols/ireduce';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import ICounted from '../../protocols/icounted';
import Reduced from '../../types/reduced';
import {indexedSeq} from '../../types/indexedseq';
import {first, rest} from '../../protocols/iseq';

extendType(Array, IReduce, {
  reduce: reduce
}, IIndexed, {
  nth: nthIndexed
}, ISeqable, {
  seq: function(self){
    return self.length ? self : null;
  }
}, ICollection, {
  conj: function(self, x){
    return self.concat([x]);
  }
}, INext, {
  next: function(self){
    return self.length > 1 ? rest(self) : null;
  }
}, ISeq, {
  first: function(self){
    return self[0] || null;
  },
  rest: function(self){
    return indexedSeq(self, 1);
  },
  toArray: identity
}, ICounted, {
  count: function(self){
    return self.length;
  }
}, IShow, {
  show: showSeq
});