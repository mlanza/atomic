import {effect, identity, constantly} from '../../core';
import {implement} from '../../protocol';
import {toArray, IMapEntry, IEquiv, IReduce, IKVReduce, IAppendable, IPrependable, IInclusive, ICollection, INext, ISeq, IFind, IArr, ISeqable, IIndexed, IAssociative, ISequential, IEmptyableCollection, IFn, IShow, ICounted, ILookup, ICloneable} from '../../protocols';
import {reduce, reducekv, reduced} from '../../types/reduced';
import {EMPTY_ARRAY} from './construct';
import {indexedSeq} from '../indexedseq';
import {showable} from '../lazyseq/behave';

function key(self){
  return self[0];
}

function val(self){
  return self[1];
}

function equiv(self, other){
  return self === other ? true : IKVReduce._reducekv(self, function(memo, key, value){
    return memo ? IEquiv.equiv(value, ILookup.lookup(other, key)) : reduced(memo);
  }, ICounted.count(self) === ICounted.count(other));
}

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

export const equivalence = implement(IEquiv, {equiv});

export default effect(
  showable,
  indexed,
  equivalence,
  implement(ISequential),
  implement(IFind, {find}),
  implement(IMapEntry, {key, val}),
  implement(IInclusive, {includes}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(ICloneable, {clone: Array.from}),
  implement(IFn, {invoke: lookup}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_ARRAY)}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeqable, {seq}),
  implement(ICollection, {conj: append}),
  implement(INext, {next}),
  implement(IArr, {toArray: identity}),
  implement(ISeq, {first, rest}));