import {effect, overload} from '../../core';
import {implement} from '../protocol';
import {reduced} from "../reduced/construct";
import {IReduce, IKVReduce, IEquiv, IObject, IDescriptive, IAssociative, ISeqable, ILookup, ICounted, IMap, ISeq, IRecord, IEmptyableCollection} from '../../protocols';
import {constructs} from '../function';
import {isRecord} from './construct';

function toObject(self){
  return self.attrs;
}

function contains(self, key){
  return self.attrs.hasOwnProperty(key);
}

function lookup(self, key){
  return self.attrs[key];
}

function seq(self){
  return ISeqable.seq(self.attrs);
}

function count(self){
  return Object.keys(self.attrs).length;
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
  return isRecord(other) && IEquiv.equiv(self.attrs, other.attrs);
}

function empty(self){
  return self.constructor.from({});
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

function construction(Type){
  Type.create = constructs(Type);
  Type.from = function(attrs){
    return Object.assign(Object.create(Type.prototype), {attrs: attrs});
  }
}

export default effect(
  construction,
  implement(IRecord),
  implement(IDescriptive),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IEquiv, {equiv}),
  implement(IObject, {toObject}),
  implement(IEmptyableCollection, {empty}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IMap, {dissoc, keys, vals}),
  implement(ISeq, {first, rest}),
  implement(ICounted, {count}),
  implement(ISeqable, {seq}));