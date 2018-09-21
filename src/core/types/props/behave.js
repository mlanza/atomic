import {identity, does} from '../../core';
import {implement} from '../protocol';
import {IDescriptive, ISeqable, IMap, IAssociative, ILookup, IDeref, IObject, IArray, ICounted, ICollection, IReduce, IInclusive, IYank} from '../../protocols';

function lookup(self, key){
  return self.node[key];
}

function contains(self, key){
  return self.node.hasOwnProperty(key);
}

function assoc(self, key, value){
  self.node[key] = value;
  return self;
}

function dissoc(self, key){
  delete self.node[key];
  return self;
}

function includes(self, [key, value]){
  return self.node[key] === value;
}

function yank(self, [key, value]){
  includes(self, [key, value]) && dissoc(self, key);
  return self;
}

function conj(self, [key, value]){
  return assoc(self, key, value);
  return self;
}

export default does(
  implement(IDescriptive),
  implement(IMap, {keys: Object.keys, vals: Object.values, dissoc}),
  implement(IInclusive, {includes}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IYank, {yank}),
  implement(ICollection, {conj}));