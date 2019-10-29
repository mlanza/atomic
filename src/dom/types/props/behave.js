import {deprecated, identity, does, implement, key, val, IDescriptive, ISeqable, IMap, IAssociative, ILookup, IDeref, ICounted, ICollection, IReduce, IInclusive, IYankable} from 'atomic/core';
import {ITransientCollection, ITransientAssociative, ITransientMap, ITransientYankable} from 'atomic/transients';

function lookup(self, key){
  return self.node[key];
}

function contains(self, key){
  return self.node.hasOwnProperty(key);
}

function _assoc(self, key, value){
  self.node[key] = value;
}

function assoc(self, key, value){
  deprecated(self, "IAssociative.assoc deprecated. Use ITransientIAssociative.assoc.");
  _assoc(self, key, value);
  return self;
}

function _dissoc(self, key){
  delete self.node[key];
}

function dissoc(self, key){
  deprecated(self, "IMap.dissoc deprecated. Use ITransientMap.dissoc.");
  _dissoc(self, key);
  return self;
}

function includes(self, entry){
  return self.node[key(entry)] === val(entry);
}

function _yank(self, entry){
  includes(self, entry) && _dissoc(self, key(entry));
}

function yank(self, entry){
  deprecated(self, "IYankable.yank deprecated. Use ITransientYankable.yank.");
  _yank(self, entry);
  return self;
}

function _conj(self, entry){
  return _assoc(self, key(entry), val(entry));
}

function conj(self, entry){
  deprecated(self, "ICollection.conj deprecated. Use ITransientCollection.conj.");
  _conj(self, entry);
  return self;
}

export default does(
  implement(IDescriptive),
  implement(ITransientMap, {dissoc: _dissoc}),
  implement(IMap, {keys: Object.keys, vals: Object.values, dissoc}),
  implement(IInclusive, {includes}),
  implement(ITransientAssociative, {assoc: _assoc}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(ITransientYankable, {yank: _yank}),
  implement(IYankable, {yank}),
  implement(ITransientCollection, {conj: _conj}),
  implement(ICollection, {conj}));