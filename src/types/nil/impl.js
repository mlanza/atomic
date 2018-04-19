import Nil from '../../types/nil/construct';
import IndexedSeq from '../../types/indexedseq/construct';
import IAssociative from '../../protocols/iassociative';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import IShow from '../../protocols/ishow';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import ICounted from '../../protocols/icounted';
import ILookup from '../../protocols/ilookup';
import IReduce from '../../protocols/ireduce';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import {empty} from '../../types/empty';
import {identity, constantly} from '../../core';
import {extendType} from '../../protocol';

extendType(Nil, IEmptyableCollection, {
  empty: identity
}, ILookup, {
  lookup: constantly(null)
}, IAssociative, {
  assoc: function(self, key, value){
    var obj = {};
    obj[key] = value;
    return obj;
  },
  contains: constantly(false)
}, INext, {
  next: identity
}, ISeq, {
  first: identity,
  rest: empty,
  toArray: constantly(Object.freeze([]))
}, ISeqable, {
  seq: identity
}, ICounted, {
  count: constantly(0)
}, IReduce, {
  _reduce: function(self, xf, init){
    return init;
  }
}, IShow, {
  show: constantly("null")
});