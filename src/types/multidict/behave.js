import {effect} from '../../core';
import {implement} from '../protocol';
import {ISeq, IArray, IReduce, IKVReduce, ICounted, ISeqable, ICollection, ILookup, IMap, IAssociative} from '../../protocols';
import {lazySeq, map} from '../lazyseq';
import {comp} from '../function/concrete';
import EmptyList from '../emptylist/construct';
import {concatenated} from '../concatenated/construct';
import record from '../record/behave';

function keys(self){
  return Object.keys(self.attrs);
}

function count(self){
  return ICounted.count(seq(self));
}

function seq(self){
  return concatenated(map(function(key){
    return map(function(value){
      return [key, value];
    }, ISeqable.seq(ILookup.lookup(self, key)) || EmptyList.EMPTY);
  }, keys(self)));
}

function first(self){
  return ISeq.first(seq(self));
}

function rest(self){
  return ISeq.rest(seq(self));
}

function lookup(self, key){
  return ILookup.lookup(self.attrs, key);
}

function assoc(self, key, value){
  const values = lookup(self, key) || self.empty(key);
  return new self.constructor(IAssociative.assoc(self.attrs, key, ICollection.conj(values, value)), self.empty);
}

function contains(self, key){
  return IAssociative.contains(self.attrs, key);
}

function reduce(self, xf, init){
  return IReduce.reduce(seq(self), function(memo, pair){
    return xf(memo, pair);
  }, init);
}

function reducekv(self, xf, init){
  return reduce(self, function(memo, [key, value]){
    return xf(memo, key, value);
  }, init);
}

export default effect(
  record,
  implement(IMap, {keys}),
  implement(IArray, {toArray: comp(Array.from, seq)}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(ICounted, {count}),
  implement(ISeqable, {seq}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeq, {first, rest}));