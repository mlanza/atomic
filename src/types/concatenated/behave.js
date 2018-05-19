import {identity, effect} from '../../core';
import {implement} from '../../protocol';
import {concatenated} from '../../types/concatenated/construct';
import {ICollection, INext, ISeq, IArr, ICounted, IReduce, ISeqable, IIndexed, IShow} from '../../protocols';
import {reduce} from '../../protocols/ireduce';
import Reduced from '../../types/reduced';
import {EMPTY} from "../empty";
import {reduceable, showable, iterable} from '../lazyseq/behave';

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
  return reduce(self.colls, function(memo, xs){
    return reduce(xs, function(memo, x){
      memo.push(x);
      return memo;
    }, memo);
  }, []);
}

function count(self){
  return IArr.toArray(self).length;
}

export default effect(
  iterable,
  reduceable,
  showable,
  implement(ICollection, {conj}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IArr, {toArray}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count}));