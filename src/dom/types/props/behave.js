import {identity, does, implement, key, val, ISeqable, IMap, IAssociative, ILookup, IDeref, ICounted, ICollection, IReduce, IInclusive} from "atomic/core";
import {ITransientCollection, ITransientAssociative, ITransientMap, ITransientOmissible} from "atomic/transients";

function lookup(self, key){
  return self.node[key];
}

function contains(self, key){
  return self.node.hasOwnProperty(key);
}

function assoc(self, key, value){
  self.node[key] = value;
}

function dissoc(self, key){
  delete self.node[key];
}

function includes(self, entry){
  return self.node[key(entry)] === val(entry);
}

function omit(self, entry){
  includes(self, entry) && _dissoc(self, key(entry));
}

function conj(self, entry){
  assoc(self, key(entry), val(entry));
}

export default does(
  implement(ITransientMap, {dissoc}),
  implement(IMap, {keys: Object.keys, vals: Object.values}),
  implement(IInclusive, {includes}),
  implement(ITransientAssociative, {assoc}),
  implement(IAssociative, {contains}),
  implement(ILookup, {lookup}),
  implement(ITransientOmissible, {omit}),
  implement(ITransientCollection, {conj}));
