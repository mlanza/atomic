import {does, constructs} from "../../core.js";
import {implement} from "../protocol.js";
import {reduced} from "../reduced/construct.js";
import {IReduce, IKVReduce, IEquiv, ICoerceable, IDescriptive, IAssociative, ISeqable, ILookup, ICounted, IMap, ISeq, IRecord, IEmptyableCollection} from "../../protocols.js";
import Symbol from "symbol";

function toObject(self){
  return self.attrs;
}

function contains(self, key){
  return self.attrs.hasOwnProperty(key);
}

function lookup(self, key){
  return ILookup.lookup(self.attrs, key);
}

function seq(self){
  return ISeqable.seq(self.attrs);
}

function count(self){
  return ICounted.count(self.attrs);
}

function first(self){
  return ISeq.first(seq(self));
}

function rest(self){
  return ISeq.rest(seq(self));
}

function keys(self){
  return IMap.keys(self.attrs);
}

function vals(self){
  return IMap.vals(self.attrs);
}

function assoc(self, key, value){
  return self.constructor.from(IAssociative.assoc(self.attrs, key, value));
}

function dissoc(self, key){
  return self.constructor.from(IMap.dissoc(self.attrs, key));
}

function equiv(self, other){
  return ICounted.count(self) === ICounted.count(other) && reducekv(self, function(memo, key, value){
    return memo ? IEquiv.equiv(ILookup.lookup(other, key), value) : reduced(memo);
  }, true);
}

function empty(self){
  return self.constructor.from({});
}

function reduce(self, xf, init){
  return IReduce.reduce(IMap.keys(self), function(memo, key){
    return xf(memo, [key, lookup(self, key)]);
  }, init);
}

function reducekv(self, xf, init){
  return IReduce.reduce(IMap.keys(self), function(memo, key){
    return xf(memo, key, lookup(self, key));
  }, init);
}

function construction(Type){
  Type.create = constructs(Type);
  Type.from || (Type.from = function(attrs){
    return Object.assign(Object.create(Type.prototype), {attrs: attrs});
  });
}

export function emptyable(Type){
  function empty(){
    return new Type();
  }
  implement(IEmptyableCollection, {empty}, Type);
}

export const behaveAsRecord = does(
  construction,
  emptyable,
  implement(IRecord),
  implement(IDescriptive),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IEquiv, {equiv}),
  implement(ICoerceable, {toObject}),
  implement(IEmptyableCollection, {empty}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IMap, {dissoc, keys, vals}),
  implement(ISeq, {first, rest}),
  implement(ICounted, {count}),
  implement(ISeqable, {seq}));