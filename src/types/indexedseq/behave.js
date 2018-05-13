import {constantly, identity, effect} from '../../core';
import {implement} from '../../protocol';
import {showSeq} from '../../common';
import {indexedSeq} from '../../types/indexedseq/construct';
import {IInclusive, IAppendable, IPrependable, ICollection, INext, ICounted, IReduce, IKVReduce, IArr, ISeq, ISeqable, ISequential, IIndexed, IShow, ILookup, IFn, IEmptyableCollection} from '../../protocols';
import Reduced, {reduce, reducekv} from '../../types/reduced';
import {EMPTY_ARRAY} from '../../types/array/construct';

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

function show(self){
  return "#indexed-seq " + showSeq(self);
}

function _reduce(self, xf, init){
  return reduce(self.arr, xf, init, self.start);
}

function _reducekv(self, xf, init){
  return reducekv(self.arr, function(memo, k, v){
    return xf(memo, k - self.start, v);
  }, init, self.start);
}

function includes(self, x){
  return self.arr.indexOf(x, self.start) > -1;
}

export default effect(
  implement(ISequential),
  implement(IInclusive, {includes: includes}),
  implement(IAppendable, {append: append}),
  implement(IPrependable, {prepend: prepend}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_ARRAY)}),
  implement(IReduce, {reduce: _reduce}),
  implement(IKVReduce, {_reducekv: _reducekv}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup: lookup}),
  implement(ICollection, {conj: append}),
  implement(INext, {next: next}),
  implement(IArr, {toArray: toArray}),
  implement(ISeq, {first: first, rest: rest}),
  implement(ISeqable, {seq: identity}),
  implement(ICounted, {count: count}),
  implement(IShow, {show: show}));