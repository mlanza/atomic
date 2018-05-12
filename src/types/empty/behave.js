import {identity, constantly, juxt} from '../../core';
import {implement} from '../../protocol';
import {empty} from '../../types/empty/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import IArr from '../../protocols/iarr';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import {EMPTY_ARRAY} from '../../types/array/construct';

export default juxt(
  implement(IEmptyableCollection, {empty: identity}),
  implement(IArr, {toArray: constantly(EMPTY_ARRAY)}),
  implement(ISeq, {first: constantly(null), rest: empty}),
  implement(INext, {next: constantly(null)}),
  implement(ISeqable, {seq: constantly(null)}),
  implement(IShow, {show: constantly("[]")}));