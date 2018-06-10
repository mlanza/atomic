import {constantly, effect, identity} from '../../core';
import {implement} from '../protocol';
import {IArray, IDecode, ISet, ICollection, IEncode, IEquiv, IMapEntry, IReduce, IKVReduce, ISeqable, IShow, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, IFn, IMap, ISeq, IDescriptive, IObject, ICloneable, IInclusive} from '../../protocols';
import {objectSelection} from '../objectselection';
import {reduced} from '../reduced';
import {lazySeq} from '../lazyseq';
import {iequiv} from '../array/behave';
import Object from '../object/construct';
import EmptyList from '../emptylist/construct';

function conj(self, [key, value]){
  const obj = ICloneable.clone(self);
  obj[key] = value;
  return obj;
}

function equiv(self, other){
  return ICounted.count(IMap.keys(self)) === ICounted.count(IMap.keys(other)) && IReduce.reduce(IMap.keys(self), function(memo, key){
    return memo ? IEquiv.equiv(ILookup.lookup(self, key), ILookup.lookup(other, key)) : reduced(memo);
  }, true);
}

function find(self, key){
  return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
}

function includes(self, mapentry){
  let key = IMapEntry.key(mapentry),
      val = IMapEntry.val(mapentry);
  return self[key] === val;
}

/*
function superset(self, subset){
  return IKVReduce.reducekv(subset, function(memo, key, value){
    return memo ? IEquiv.equiv(get(self, key), value) : reduced(memo);
  }, true);
}
*/

function lookup(self, key){
  return self[key];
}

function seqObject(self, keys){
  var key = ISeq.first(keys);
  return ISeqable.seq(keys) ? lazySeq([key, self[key]], function(){
    return seqObject(self, ISeq.rest(keys));
  }) : EmptyList.EMPTY;
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
  return IReduce.reduce(IMap.keys(self), function(memo, key){
    return xf(memo, [key, self[key]]);
  }, init);
}

function reducekv(self, xf, init){
  return IReduce.reduce(IMap.keys(self), function(memo, key){
    return xf(memo, key, self[key]);
  }, init);
}

function show(self){
  const xs = IArray.toArray(seq(self));
  return "{" + xs.map(function(pair){
    return IShow.show(pair[0]) + ": " + IShow.show(pair[1]);
  }).join(", ") + "}";
}

function encode(self, label, refstore, seed){
 return reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, IEncode.encode(key, label, refstore, seed), IEncode.encode(value, label, refstore, seed));
  }, {});
}

function decode(self, label, constructors){
  if (IAssociative.contains(self, label)){
    if (IAssociative.contains(self, "data")) {
      const constructor = ILookup.lookup(constructors, ILookup.lookup(self, label));
      return constructor(ILookup.lookup(self, "data"));
    } else {
      throw new Error("Cannot decode reference types.");
    }
  } else {
    return self;
  }
}

export default effect(
  iequiv,
  implement(IDescriptive),
  implement(IEquiv, {equiv}),
  implement(IDecode, {decode}),
  implement(IEncode, {encode}),
  implement(IObject, {toObject: identity}),
  implement(IFind, {find}),
  //implement(ISet, {superset}),
  implement(IInclusive, {includes}),
  implement(ICollection, {conj}),
  implement(ICloneable, {clone}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IMap, {dissoc, keys: Object.keys, vals: Object.values}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup: lookup}),
  implement(IEmptyableCollection, {empty: constantly(Object.EMPTY)}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}),
  implement(IShow, {show}));