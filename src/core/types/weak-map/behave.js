import {does, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {ICounted, IAssociative, ILookup, ICloneable} from "../../protocols.js";

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

export const behaveAsWeakMap = does(
  implement(ICloneable, {clone: identity}),
  implement(ICounted, {count}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}));