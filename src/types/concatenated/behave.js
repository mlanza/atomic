import {identity, effect} from '../../core';
import {implement} from '../../protocol';
import {toArraySeq, showSeq, reduceSeq} from '../../common';
import {concatenated} from '../../types/concatenated/construct';
import {ICollection, INext, ISeq, IArr, ICounted, IReduce, ISeqable, IIndexed, IShow} from '../../protocols';
import {reduce} from '../../protocols/ireduce';
import Reduced from '../../types/reduced';
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
  let colls = IArr.toArray(ISeq.rest(self.colls));
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

export default effect(
  implement(IReduce, {reduce: reduceSeq}),
  implement(ICollection, {conj: conj}),
  implement(INext, {next: next}),
  implement(ISeq, {first: first, rest: rest}),
  implement(IArr, {toArray: toArray}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count: count}),
  implement(IShow, {show: show}));