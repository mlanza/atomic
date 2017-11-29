import Nil from '../../types/nil';
import IndexedSeq from '../../types/indexedseq';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import IShow from '../../protocols/ishow';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import {empty} from '../../types/empty';
import {identity, constantly} from '../../core';
import {extendType} from '../../protocol';

extendType(Nil, INext, {
  next: identity
}, ISeq, {
  first: identity,
  rest: empty,
  toArray: function(){
    return [];
  }
}, ISeqable, {
  seq: identity
}, IShow, {
  show: constantly("null")
});