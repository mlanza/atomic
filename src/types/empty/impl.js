import {identity, constantly} from '../../core';
import {extendType} from '../../protocol';
import Empty, {empty} from '../../types/empty/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import {first, rest, toArray} from '../../protocols/iseq';

extendType(Empty, IEmptyableCollection, {
  empty: identity
}, ISeq, {
  first: constantly(null),
  rest: empty,
  toArray: constantly(Object.freeze([]))
}, INext, {
  next: constantly(null)
}, ISeqable, {
  seq: constantly(null)
}, IShow, {
  show: constantly("[]")
});