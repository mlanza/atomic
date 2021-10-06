import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import Symbol from "symbol";

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
  return self.node[_.key(entry)] === _.val(entry);
}

function omit(self, entry){
  includes(self, entry) && _dissoc(self, _.key(entry));
}

function conj(self, entry){
  assoc(self, _.key(entry), _.val(entry));
}

export default _.does(
  _.naming(?, Symbol("Props")),
  _.implement(_.IMap, {keys: Object.keys, vals: Object.values}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.IAssociative, {contains}),
  _.implement(_.ILookup, {lookup}),
  _.implement(mut.ITransientAssociative, {assoc}),
  _.implement(mut.ITransientMap, {dissoc}),
  _.implement(mut.ITransientOmissible, {omit}),
  _.implement(mut.ITransientCollection, {conj}));
