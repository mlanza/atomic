import {implement} from '../protocol';
import {identity, does} from '../../core';
import {ICoerce, IDescriptive, IFind, ICollection, IReduce, IKVReduce, INext, ISeq, ISeqable, IIndexed, ICounted, ILookup, IFn, IMap, ICloneable, IEmptyableCollection} from '../../protocols';
import {lazySeq} from '../../types/lazy-seq/construct';
import {cons} from '../../types/list/construct';
import {remove, into} from '../../types/lazy-seq/concrete';
import {Object, emptyObject} from '../../types/object/construct';
import {iequiv} from '../../types/array/behave';
import {iset} from '../../types/object/behave';

function toObject(self){
  return into({}, self);
}

function find(self, key){
  return IInclusive.includes(IMap.keys(self), key) ? [key, ILookup.lookup(self.obj, key)] : null;
}

function lookup(self, key){
  return IInclusive.includes(IMap.keys(self), key) ? self.obj[key] : null;
}

function dissoc(self, key){
  return new self.constructor(self, remove(function(k){
    return k === key;
  }, self.keys));
}

function keys(self){
  return self.keys;
}

function vals(self){
  const key = ISeq.first(self.keys);
  return lazySeq(function(){
    return cons(lookup(self, key), vals(new self.constructor(self.obj, ISeq.rest(self.keys))));
  });
}

function seq(self){
  const key = ISeq.first(self.keys);
  return lazySeq(function(){
    return cons([key, lookup(self, key)], new self.constructor(self.obj, ISeq.rest(self.keys)));
  });
}

function count(self){
  return ICounted.count(self.keys);
}

function clone(self){
  return toObject(self);
}

function reduce(self, xf, init){
  return IReduce.reduce(keys(self), function(memo, key){
    return xf(memo, [key, lookup(self, key)]);
  }, init);
}

function reducekv(self, xf, init){
  return IReduce.reduce(keys(self), function(memo, key){
    return xf(memo, key, lookup(self, key));
  }, init);
}

export const behaveAsAssociativeSubset = does(
  iset,
  iequiv,
  implement(IDescriptive),
  implement(ICoerce, {toObject}),
  implement(IFind, {find}),
  implement(IMap, {dissoc, keys, vals}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(ICloneable, {clone}),
  implement(IEmptyableCollection, {empty: emptyObject}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}));