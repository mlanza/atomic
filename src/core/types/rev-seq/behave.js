import {constantly, identity, effect, overload} from '../../core';
import {implement} from '../protocol';
import EmptyList from '../../types/empty-list/construct';
import {cons} from '../../types/list/construct';
import {Reduced, unreduced} from '../../types/reduced';
import {ISequential, IArray, ICloneable, IReduce, ICollection, IEmptyableCollection, INext, ISeq, ICounted, ISeqable, IIndexed} from '../../protocols';
import {revSeq} from './construct';
import {iterable} from '../lazy-seq/behave';

function clone(self){
  return new revSeq(self.coll, self.idx);
}

function count(self){
  return self.idx + 1;
}

function first(self){
  return IIndexed.nth(self.coll, self.idx);
}

function rest(self){
  return next(self) || EmptyList.EMPTY;
}

function next(self){
  return self.idx > 0 ? revSeq(self.coll, self.idx - 1) : null;
}

function conj(self, value){
  return cons(value, self);
}

function reduce2(coll, f){
  let xs = seq(coll);
  return xs ? IReduce.reduce(INext.next(xs), f, ISeq.first(xs)) : f();
}

function reduce3(coll, f, init){
  let memo = init,
      xs   = seq(coll);
  while(xs){
    let memo = f(memo, first(xs));
    if (memo instanceof Reduced) {
      return unreduced(memo);
    }
    xs = next(xs);
  }
  return memo;
}

const reduce = overload(null, null, reduce2, reduce3);

export default effect(
  iterable,
  implement(ISequential),
  implement(IArray, {toArray: Array.from}),
  implement(IEmptyableCollection, {empty: constantly(EmptyList.EMPTY)}),
  implement(IReduce, {reduce}),
  implement(ICollection, {conj}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}),
  implement(ISeqable, {seq: identity}),
  implement(ICloneable, {clone}));