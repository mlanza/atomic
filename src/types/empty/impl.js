import {identity, constantly, juxt, EMPTY_ARRAY} from '../../core';
import {implement} from '../../protocol';
import {empty} from '../../types/empty/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import IEmptyableCollection from '../../protocols/iemptyablecollection';

export default juxt(
  implement(IEmptyableCollection, {empty: identity}),
  implement(ISeq, {first: constantly(null), rest: empty, toArray: constantly(EMPTY_ARRAY)}),
  implement(INext, {next: constantly(null)}),
  implement(ISeqable, {seq: constantly(null)}),
  implement(IShow, {show: constantly("[]")}));