import {constantly, effect, identity} from '../../core';
import {implement} from '../protocol';
import {IArray, ISteppable, IComparable, INext, IEquiv, IReduce, IKVReduce, ISeqable, IShow, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, ISeq, IInclusive} from '../../protocols';
import {reduced} from '../reduced';
import {lazySeq} from '../lazyseq';
import {EMPTY} from '../empty';
import {period} from './construct';

function seq(self){
  return lazySeq(first(self), function(){
    return rest(self);
  });
}

function first(self){
  return self.start;
}

function rest(self){
  return next(self) || EMPTY;
}

function next(self){
  const second = ISteppable.step(self.step, self.start);
  return IComparable.compare(second, self.end) < 0 ? period(second, self.end, self.step) : null;
}

function equiv(self, other){
  return IEquiv.equiv(self.start, other.start) && IEquiv.equiv(self.end, other.end) && IEquiv.equiv(self.step, other.step);
}

function reduce(self, xf, init){
  return IReduce.reduce(ISeqable.seq(self), xf, init);
}

export default effect(
  implement(ISeqable, {seq: identity}),
  implement(IReduce, {reduce}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IEquiv, {equiv}));