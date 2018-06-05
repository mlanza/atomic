import {constantly, effect, identity} from '../../core';
import {implement} from '../protocol';
import {IArray, ISteppable, ICollection, IComparable, INext, IEquiv, IReduce, IKVReduce, ISeqable, IShow, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, ISeq, IInclusive} from '../../protocols';
import {reduced} from '../reduced';
import {lazySeq} from '../lazyseq';
import {period, Period} from './construct';

function seq(self){
  return lazySeq(first(self), function(){
    return rest(self);
  });
}

function first(self){
  return self.start;
}

function rest(self){
  return next(self) || Period.EMPTY;
}

function next(self){
  if (self === Period.EMPTY) {
    return null;
  }
  const second = ISteppable.step(self.step, self.start);
  return IComparable.compare(second, self.end) < 0 ? period(second, self.end, self.step) : null;
}

function equiv(self, other){
  return IEquiv.equiv(self.start, other.start) && IEquiv.equiv(self.end, other.end) && IEquiv.equiv(self.step, other.step);
}

function reduce(self, xf, init){
  return IReduce.reduce(ISeqable.seq(self), xf, init);
}

function toArray(self){
  return reduce(self, ICollection.conj, []);
}

export default effect(
  implement(ISequential),
  implement(IArray, {toArray}),
  implement(ISeqable, {seq: identity}),
  implement(IEmptyableCollection, {empty: constantly(Period.EMPTY)}),
  implement(IReduce, {reduce}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IEquiv, {equiv}));