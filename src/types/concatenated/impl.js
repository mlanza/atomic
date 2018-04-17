import {identity} from '../../core';
import {extendType} from '../../protocol';
import {toArraySeq, showSeq, reduceSeq} from '../../common';
import Concatenated, {concat} from '../../types/concatenated/construct';
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

extendType(Concatenated, IReduce, {
  reduce: reduceSeq
}, ICollection,{
  conj: function(self, x){
    return concat(self.colls.concat([x]));
  }
}, INext, {
  next: function(self){
    var tail = rest(self);
    return tail === EMPTY ? null : tail;
  }
}, ISeq, {
  first: function(self){
    return first(first(self.colls));
  },
  rest: function(self){
    return concat.apply(null, [rest(first(self.colls))].concat(toArray(rest(self.colls))));
  },
  toArray: toArraySeq
}, ISeqable, {
  seq: identity
}, ICounted, {
  count: function(self){
    return toArray(self).length;
  }
}, IShow, {
  show: function(self){
    return "#concat " + showSeq(self);
  }
});