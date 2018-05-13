import {implement} from '../../protocol';
import {constantly, effect} from '../../core';
import {objectSelection} from '../../types/objectselection';
import {lazySeq} from '../../types/lazyseq';
import {EMPTY} from '../../types/empty/construct';
import {IReduce, IKVReduce, ISeqable, IShow, ICounted, IAssociative, IEmptyableCollection, ILookup, IFn, IMap, ISeq, IArr, ICloneable, IInclusive} from '../../protocols';
import {reducekv} from '../../protocols/ikvreduce';
import {EMPTY_OBJECT} from '../../types/object/construct';

function includes(superset, subset){
  return reducekv(function(memo, key, value){
    return memo ? get(superset, key) === value : new Reduced(memo);
  }, true, seq(subset));
}

function lookup(self, key){
  return self[key];
}

function seqObject(self, keys){
  var key = ISeq.first(keys);
  return ISeqable.seq(keys) ? lazySeq([key, self[key]], function(){
    return seqObject(self, ISeq.rest(keys));
  }) : EMPTY;
}

function _dissoc(obj, key){
  const result = Object.assign({}, obj);
  delete result[key];
  return result;
}

function assoc(self, key, value){
  const obj = Object.assign({}, self);
  obj[key] = value;
  return obj;
}

function contains(self, key){
  return self.hasOwnProperty(key);
}

function seq(self){
  return seqObject(self, Object.keys(self));
}

function count(self){
  return ICounted.count(Object.keys(self));
}

function clone(self){
  return Object.assign({}, self);
}

function _reduce(self, xf, init){
  let memo = init;
  Object.keys(self).forEach(function(key){
    memo = xf(memo, [key, self[key]]);
  });
  return memo;
}

function _reducekv(self, xf, init){
  let memo = init;
  Object.keys(self).forEach(function(key){
    memo = xf(memo, key, self[key]);
  });
  return memo;
}

function show(self){
  const xs = IArr.toArray(seq(self));
  return "{" + xs.map(function(pair){
    return show(pair[0]) + ": " + show(pair[1]);
  }).join(", ") + "}";
}

export default effect(
  implement(IInclusive, {includes: includes}),
  implement(ICloneable, {clone: clone}),
  implement(IReduce, {_reduce: _reduce}),
  implement(IKVReduce, {_reducekv: _reducekv}),
  implement(IMap, {_dissoc: _dissoc}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup: lookup}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_OBJECT)}),
  implement(IAssociative, {assoc: assoc, contains: contains}),
  implement(ISeqable, {seq: seq}),
  implement(ICounted, {count: count}),
  implement(IShow, {show: show}));