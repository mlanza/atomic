import {constantly, identity, does} from '../../core';
import {implement} from '../protocol';
import {indexedSeq} from './construct';
import {revSeq} from '../../types/rev-seq/construct';
import {reduced, isReduced, unreduced} from '../../types/reduced';
import {IArray, IEquiv, IReversible, IMapEntry, IFind, IInclusive, IAssociative, IAppendable, IPrependable, ICollection, INext, ICounted, IReduce, IKVReduce, ISeq, ISeqable, ISequential, IIndexed, ILookup, IFn, IEmptyableCollection} from '../../protocols';
import {locate} from '../../protocols/ilocate/concrete';
import {concat} from '../../types/concatenated/construct';
import {iterable} from '../lazy-seq/behave';
import {drop} from '../lazy-seq/concrete';
import {encodeable} from '../record/behave';
import {emptyArray} from '../../types/array/construct';

function reverse(self){
  let c = ICounted.count(self);
  return c > 0 ? revSeq(self, c - 1) : null;
}

function key(self){
  return lookup(self, 0);
}

function val(self){
  return lookup(self, 1);
}

function find(self, key){
  return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
}

function contains(self, key){
  return key < ICounted.count(self.seq) - self.start;
}

function lookup(self, key){
  return ILookup.lookup(self.seq, self.start + key);
}

function append(self, x){
  return concat(self, [x]);
}

function prepend(self, x){
  return concat([x], self);
}

function next(self){
  var pos = self.start + 1;
  return pos < ICounted.count(self.seq) ? indexedSeq(self.seq, pos) : null;
}

function nth(self, idx){
  return IIndexed.nth(self.seq, idx + self.start);
}

function first(self){
  return nth(self, 0);
}

function rest(self){
  return indexedSeq(self.seq, self.start + 1);
}

function toArray(self){
  return reduce(self, function(memo, x){
    memo.push(x);
    return memo;
  }, []);
}

function count(self){
  return ICounted.count(self.seq) - self.start;
}

function reduce(self, xf, init){
  let memo = init,
      coll = ISeqable.seq(self);
  while (coll && !isReduced(memo)){
    memo = xf(memo, ISeq.first(coll));
    coll = INext.next(coll);
  }
  return unreduced(memo);
}

function reducekv(self, xf, init){
  let idx = 0;
  return reduce(self, function(memo, value){
    memo = xf(memo, idx, value);
    idx += 1;
    return memo;
  }, init);
}

function includes(self, x){
  return locate(drop(self.start, self.seq), function(y){
    return IEquiv.equiv(x, y);
  });
}

export default does(
  iterable,
  encodeable,
  implement(ISequential),
  implement(IIndexed, {nth}),
  implement(IReversible, {reverse}),
  implement(IMapEntry, {key, val}),
  implement(IInclusive, {includes}),
  implement(IFind, {find}),
  implement(IAssociative, {contains}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty: emptyArray}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup}),
  implement(ICollection, {conj: append}),
  implement(INext, {next}),
  implement(IArray, {toArray}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count}));