import {does, identity, implement, IMap, ICounted, IAssociative, ILookup, ICloneable} from "atomic/core";

function assoc(self, key, value){
  return self.set(key, value);
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

function keys(self){
  return self.keys();
}

function vals(self){
  return self.values();
}

function dissoc(self, key){
  return self.remove(self, key);
}

export default does(
  implement(IMap, {keys, vals, dissoc}),
  implement(ICloneable, {clone: identity}),
  implement(ICounted, {count}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}));