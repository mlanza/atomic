import {identity, does} from '../../core';
import {implement} from '../protocol';
import {concatenated, concat} from '../../types/concatenated/construct';
import {isReduced, unreduced} from '../../types/reduced';
import {IArray, ICollection, INext, ISeq, ICounted, ISeqable, IIndexed, IReduce, ISequential} from '../../protocols';
import {apply} from '../../types/function/concrete';
import EmptyList from '../empty-list';
import {ireduce, iterable} from '../lazy-seq/behave';
import {encodeable} from '../record/behave';

function conj(self, x){
  return new self.constructor(ICollection.conj(self.colls, [x]));
}

function next(self){
  const tail = ISeq.rest(self);
  return ISeqable.seq(tail) ? tail : null;
}

function first(self){
  return ISeq.first(ISeq.first(self.colls));
}

function rest(self){
  return apply(concat, ISeq.rest(ISeq.first(self.colls)), ISeq.rest(self.colls));
}

function toArray(self){
  return reduce(self, function(memo, value){
    memo.push(value);
    return memo;
  }, []);
}

function reduce(self, xf, init){
  let memo = init,
      remaining = self;
  while(!isReduced(memo) && ISeqable.seq(remaining)){
    memo = xf(memo, ISeq.first(remaining))
    remaining = INext.next(remaining);
  }
  return unreduced(memo);
}

function count(self){
  return reduce(self, function(memo, value){
    return memo + 1;
  }, 0);
}

export default does(
  iterable,
  ireduce,
  encodeable,
  implement(ISequential),
  implement(IReduce, {reduce}),
  implement(ICollection, {conj}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IArray, {toArray}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count}));