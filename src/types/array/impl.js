import {identity, constantly, reduce, slice, EMPTY_ARRAY} from '../../core';
import {extendType} from '../../protocol';
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
import Reduced from '../../types/reduced';
import {indexedSeq} from '../../types/indexedseq';
import {first, rest} from '../../protocols/iseq';

function lookup(self, key){
  return self[key];
}

extendType(Array, ISequential, {}, IFn, {
  invoke: lookup
}, IEmptyableCollection, {
  empty: constantly(EMPTY_ARRAY)
}, IReduce, {
  _reduce: reduce
}, ILookup, {
  lookup: lookup
}, IAssociative, {
  assoc: function(self, key, value){
    var arr = slice(self);
    arr.splice(key, 1, value);
    return arr;
  },
  contains: function(self, key){
    return key > -1 && key < self.length;
  }
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