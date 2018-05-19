import {constantly, identity, effect} from '../../core';
import {implement} from '../../protocol';
import {indexedSeq} from '../../types/indexedseq/construct';
import {IMapEntry, IFind, IInclusive, IAssociative, IAppendable, IPrependable, ICollection, INext, ICounted, IReduce, IKVReduce, IArr, ISeq, ISeqable, ISequential, IIndexed, IShow, ILookup, IFn, IEmptyableCollection} from '../../protocols';
import * as r from '../../types/reduced';
import {EMPTY_ARRAY} from '../../types/array/construct';
import {showable, iterable} from '../lazyseq/behave';

function key(self){
  return lookup(self, 0);
}

function val(self){
  return lookup(self, 1);
}

function find(self, key){
  return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
}

function contains(self, idx){
  return idx < self.arr.length - self.start;
}

function lookup(self, key){
  return self.arr[self.start + key];
}

function append(self, x){
  return toArray(self).concat([x]);
}

function prepend(self, x){
  return [x].concat(toArray(self));
}

function next(self){
  var pos = self.start + 1;
  return pos < self.arr.length ? indexedSeq(self.arr, pos) : null;
}

function first(self){
  return self.arr[self.start];
}

function rest(self){
  return indexedSeq(self.arr, self.start + 1);
}

function toArray(self){
  return self.arr.slice(self.start);
}

function count(self){
  return self.length - self.start;
}

function reduce(self, xf, init){
  return r.reduce(self.arr, xf, init, self.start);
}

function reducekv(self, xf, init){
  return r.reducekv(self.arr, function(memo, k, v){
    return xf(memo, k - self.start, v);
  }, init, self.start);
}

function includes(self, x){
  return self.arr.indexOf(x, self.start) > -1;
}

export default effect(
  showable,
  iterable,
  implement(ISequential),
  implement(IMapEntry, {key, val}),
  implement(IInclusive, {includes}),
  implement(IFind, {find}),
  implement(IAssociative, {contains}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_ARRAY)}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup}),
  implement(ICollection, {conj: append}),
  implement(INext, {next}),
  implement(IArr, {toArray}),
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count}));