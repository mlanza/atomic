import {overload, does} from "../../core.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {implement, satisfies} from "../protocol.js";
import {ICounted, ILookup, IAssociative, IMap, ICloneable} from "../../protocols.js";

function clone(self){
  return new self.constructor(self);
}

function contains(self, key){
  return self.has(key);
}

function assoc(self, key, value){
  const other = clone(self);
  other.set(key, value);
  return other;
}

function dissoc(self, key){
  const other = clone(self);
  other.delete(key);
  return other;
}

function lookup(self, key){
  return self.get(key);
}

function count(self){
  return self.size;
}

export default does(
  keying("Map"),
  implement(ICounted, {count}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {contains, assoc}),
  implement(IMap, {dissoc}));
