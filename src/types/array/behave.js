import {effect, identity, constantly} from '../../core';
import {implement} from '../../protocol';
import {IReduce, IKVReduce, IAppendable, IPrependable, IInclusive, ICollection, INext, ISeq, IFind, IArr, ISeqable, IIndexed, IAssociative, ISequential, IEmptyableCollection, IFn, IShow, ICounted, ILookup, ICloneable} from '../../protocols';
import {reduce, reducekv} from '../../types/reduced';
import {EMPTY_ARRAY} from './construct';
import {indexedSeq} from '../indexedseq';
import {showable} from '../lazyseq/behave';

function find(self, key){
  return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
}

function lookup(self, key){
  return self[key];
}

function assoc(self, key, value){
  var arr = Array.from(self);
  arr.splice(key, 1, value);
  return arr;
}

function contains(self, key){
  return key > -1 && key < self.length;
}

function seq(self){
  return self.length ? self : null;
}

function append(self, x){
  return self.concat([x]);
}

function prepend(self, x){
  return [x].concat(self);
}

function next(self){
  return self.length > 1 ? ISeq.rest(self) : null;
}

function first(self){
  return self[0] || null;
}

function rest(self){
  return indexedSeq(self, 1);
}

function includes(self, x){
  return self.indexOf(x) > -1;
}

function length(self){
  return self.length;
}

function nth(coll, idx, notFound){
  return coll[idx] || notFound || null;
}

export const indexed = effect(
  implement(IIndexed, {nth: nth}),
  implement(ICounted, {count: length}));

export default effect(
  showable,
  indexed,
  implement(ISequential),
  implement(IFind, {find: find}),
  implement(IInclusive, {includes: includes}),
  implement(IAppendable, {append: append}),
  implement(IPrependable, {prepend: prepend}),
  implement(ICloneable, {clone: Array.from}),
  implement(IFn, {invoke: lookup}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_ARRAY)}),
  implement(IReduce, {_reduce: reduce}),
  implement(IKVReduce, {_reducekv: reducekv}),
  implement(ILookup, {lookup: lookup}),
  implement(IAssociative, {assoc: assoc,contains: contains}),
  implement(ISeqable, {seq: seq}),
  implement(ICollection, {conj: append}),
  implement(INext, {next: next}),
  implement(IArr, {toArray: identity}),
  implement(ISeq, {first: first, rest: rest}));