import {identity} from '../../core';
import {extendType} from '../../protocol';
import {toArraySeq, showSeq, reduceSeq} from '../../common';
import Transduced from '../../types/transduced';
import {concat} from '../../types/concatenated';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import ICounted from '../../protocols/icounted';
import IReduce from '../../protocols/ireduce';
import Reduced from '../../types/reduced';
import {first, rest, toArray} from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';

extendType(Transduced, IReduce, {
  reduce: reduceSeq
}, INext, {
  next: function(self){
    var tail = rest(self);
    return tail === EMPTY ? null : tail;
  }
}, ISeq, {
  first: function(self){
    self.materialize();
    return first(self.mat);
  },
  rest: function(self){
    self.materialize();
    return rest(self.mat);
  },
  toArray: toArraySeq
}, ISeqable, {
  seq: identity
}, ICounted, {
  count: function(self){
    return toArray(self).length;
  }
}, IShow, {
  show: showSeq
});