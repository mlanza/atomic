import {identity, does, implement, key, val, IDescriptive, ISeqable, IMap, IAssociative, ILookup, IDeref, ICounted, ICollection, IReduce, IInclusive, IYank} from 'atomic/core';

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

function includes(self, entry){
  return self.node[key(entry)] === val(entry);
}

function yank(self, entry){
  includes(self, entry) && dissoc(self, key(entry));
  return self;
}

function conj(self, entry){
  return assoc(self, key(entry), val(entry));
}

export default does(
  implement(IDescriptive),
  implement(IMap, {keys: Object.keys, vals: Object.values, dissoc}),
  implement(IInclusive, {includes}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IYank, {yank}),
  implement(ICollection, {conj}));