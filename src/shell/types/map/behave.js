import * as _ from "atomic/core";
import {IAssociative, IMap} from "../../protocols.js";

function assoc(self, key, value){
  self.set(key, value);
}

function dissoc(self, key, value){
  self.delete(key, value);
}

function contains(self, key){
  return self.has(key);
}

function lookup(self, key){
  return self.get(key);
}

function count(self){
  return self.size;
}

export default _.does(
  _.keying("Map"),
  _.implement(_.ICounted, {count}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IAssociative, {contains}),
  _.implement(IMap, {dissoc}),
  _.implement(IAssociative, {assoc}));
