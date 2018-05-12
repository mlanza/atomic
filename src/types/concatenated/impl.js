import {identity, juxt} from '../../core';
import {implement} from '../../protocol';
import {toArraySeq, showSeq, reduceSeq} from '../../common';
import {concatenated} from '../../types/concatenated/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import ICounted from '../../protocols/icounted';
import IReduce, {reduce} from '../../protocols/ireduce';
import Reduced from '../../types/reduced';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import {EMPTY} from "../empty";

function conj(self, x){
  return concatenated(ICollection.conj(self.colls, [x]));
}

function next(self){
  const tail = ISeq.rest(self);
  return tail === EMPTY ? null : tail;
}

function first(self){
  return ISeq.first(ISeq.first(self.colls));
}

function rest(self){
  const tail  = INext.next(ISeq.first(self.colls));
  let colls = ISeq.toArray(ISeq.rest(self.colls));
  if (tail) {
    colls = [tail].concat(colls);
  }
  return concatenated(colls);
}

function toArray(self){
  return reduce(function(memo, xs){
    return reduce(function(memo, x){
      memo.push(x);
      return memo;
    }, memo, xs);
  }, [], self.colls);
}

function count(self){
  return toArray(self).length;
}

function show(self){
  return "#concat " + showSeq(self);
}

export default juxt(
  implement(IReduce, {reduce: reduceSeq}),
  implement(ICollection, {conj: conj}),
  implement(INext, {next: next}),
  implement(ISeq, {first: first, rest: rest, toArray: toArray}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count: count}),
  implement(IShow, {show: show}));