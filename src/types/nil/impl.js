import Nil from '../../types/nil/construct';
import IndexedSeq from '../../types/indexedseq/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import IShow from '../../protocols/ishow';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import ICounted from '../../protocols/icounted';
import {empty} from '../../types/empty';
import {identity, constantly} from '../../core';
import {extendType} from '../../protocol';

extendType(Nil, INext, {
  next: identity
}, ISeq, {
  first: identity,
  rest: empty,
  toArray: constantly(Object.freeze([]))
}, ISeqable, {
  seq: identity
}, ICounted, {
  count: constantly(0)
}, IShow, {
  show: constantly("null")
});