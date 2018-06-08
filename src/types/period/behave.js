import {constantly, effect, identity} from '../../core';
import {implement} from '../protocol';
import {IArray, ISteppable, ISequential, ICollection, IComparable, INext, IEquiv, IReduce, IKVReduce, ISeqable, IShow, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, ISeq, IInclusive} from '../../protocols';
import {reduced, unreduced, isReduced} from '../reduced';
import {lazySeq} from '../lazyseq';
import {period, Period, EMPTY_PERIOD} from './construct';

function first(self){
  return self.start;
}

function rest(self){
  return next(self) || EMPTY_PERIOD;
}

function next(self){
  if (self === EMPTY_PERIOD) {
    return null;
  }
  const second = ISteppable.step(self.step, self.start);
  return IComparable.compare(second, self.end) <= 0 ? period(second, self.end, self.step) : null;
}

function equiv(self, other){
  return IEquiv.equiv(self.start, other.start) && IEquiv.equiv(self.end, other.end) && IEquiv.equiv(self.step, other.step);
}

function reduce(self, xf, init){
  let memo = init,
      coll = self;
  while(coll && !isReduced(memo)){
    memo = xf(memo, ISeq.first(coll));
    coll = INext.next(coll);
  }
  return unreduced(memo);
}

function toArray(self){
  return reduce(self, function(memo, date){
    memo.push(date);
    return memo;
  }, []);
}

export default effect(
  implement(ISequential),
  implement(IArray, {toArray}),
  implement(ISeqable, {seq: identity}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_PERIOD)}),
  implement(IReduce, {reduce}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IEquiv, {equiv}));