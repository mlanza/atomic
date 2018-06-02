import {constantly, effect, identity} from '../../core';
import {implement} from '../protocol';
import {ISet, IEquiv, IMapEntry, IReduce, IKVReduce, ISeqable, ISequential, IShow, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, IFn, IMap, ISeq, IObj, ICloneable, IInclusive} from '../../protocols';
import {objectSelection} from '../objectselection';
import {reduced} from '../reduced';
import {lazySeq} from '../lazyseq';
import {equivalence} from '../array/behave';
import {EMPTY_OBJECT} from '../object/construct';
import {EMPTY} from '../empty/construct';

function find(self, key){
  return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
}

function includes(self, mapentry){
  let key = IMapEntry.key(mapentry),
      val = IMapEntry.val(mapentry);
  return self[key] === val;
}

function superset(self, subset){
  return IKVReduce.reducekv(subset, function(memo, key, value){
    return memo ? IEquiv.equiv(get(self, key), value) : reduced(memo);
  }, true);
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

function dissoc(obj, key){
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

function reduce(self, xf, init){
  return IReduce.reduce(Object.keys(self), function(memo, key){
    return xf(memo, [key, self[key]]);
  }, init);
}

function reducekv(self, xf, init){
  return IReduce.reduce(Object.keys(self), function(memo, key){
    return xf(memo, key, self[key]);
  }, init);
}

function show(self){
  const xs = ISequential.toArray(seq(self));
  return "{" + xs.map(function(pair){
    return show(pair[0]) + ": " + show(pair[1]);
  }).join(", ") + "}";
}

export default effect(
  equivalence,
  implement(IObj, {toObject: identity}),
  implement(IFind, {find}),
  implement(ISet, {superset}),
  implement(IInclusive, {includes}),
  implement(ICloneable, {clone}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IMap, {dissoc, keys: Object.keys, vals: Object.values}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup: lookup}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_OBJECT)}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}),
  implement(IShow, {show}));