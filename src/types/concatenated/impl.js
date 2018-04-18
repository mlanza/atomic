import {identity} from '../../core';
import {extendType} from '../../protocol';
import {toArraySeq, showSeq, reduceSeq} from '../../common';
import Concatenated, {concat, concatenated} from '../../types/concatenated/construct';
import ICollection, {conj} from '../../protocols/icollection';
import INext, {next} from '../../protocols/inext';
import ISeq, {first, rest, toArray} from '../../protocols/iseq';
import ICounted from '../../protocols/icounted';
import IReduce, {reduce} from '../../protocols/ireduce';
import Reduced from '../../types/reduced';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import {EMPTY} from "../empty";

extendType(Concatenated, IReduce, {
  reduce: reduceSeq
}, ICollection,{
  conj: function(self, x){
    return concatenated(conj(self.colls, [x]));
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
    var tail  = next(first(self.colls));
    var colls = toArray(rest(self.colls));
    if (tail) {
      colls = [tail].concat(colls);
    }
    return concatenated(colls);
  },
  toArray: function(self){
    return reduce(self.colls, function(memo, xs){
      return reduce(xs, function(memo, x){
        memo.push(x);
        return memo;
      }, memo);
    }, []);
  }
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