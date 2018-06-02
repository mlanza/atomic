import {effect, overload} from '../../core';
import {implement} from '../protocol';
import {IObject, IDescriptive, IAssociative, ISeqable, ILookup, ICounted, IMap, ISeq, IRecord} from '../../protocols';
import {constructs} from '../function';

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
  implement(IObject, {toObject}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IMap, {dissoc, keys, vals}),
  implement(ISeq, {first, rest}),
  implement(ICounted, {count}),
  implement(ISeqable, {seq}));