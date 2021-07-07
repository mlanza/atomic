import {does, constructs} from "../../core.js";
import {implement} from "../protocol.js";
import {reduced} from "../reduced/construct.js";
import {IReduce, IKVReduce, IEquiv, ICoerceable, IAssociative, ISeqable, ILookup, ICounted, IMap, ISeq, IEmptyableCollection} from "../../protocols.js";
import Symbol from "symbol";
import * as p from "./protocols.js";

function toObject(self){
  return self.attrs;
}

function contains(self, key){
  return self.attrs.hasOwnProperty(key);
}

function lookup(self, key){
  return p.get(self.attrs, key);
}

function seq(self){
  return p.seq(self.attrs);
}

function count(self){
  return p.count(self.attrs);
}

function first(self){
  return p.first(seq(self));
}

function rest(self){
  return p.rest(seq(self));
}

function keys(self){
  return p.keys(self.attrs);
}

function vals(self){
  return p.vals(self.attrs);
}

function assoc(self, key, value){
  return self.constructor.from(p.assoc(self.attrs, key, value));
}

function dissoc(self, key){
  return self.constructor.from(p.dissoc(self.attrs, key));
}

function equiv(self, other){
  return p.count(self) === p.count(other) && reducekv(self, function(memo, key, value){
    return memo ? p.equiv(p.get(other, key), value) : reduced(memo);
  }, true);
}

function empty(self){
  return self.constructor.from({});
}

function reduce(self, xf, init){
  return p.reduce(function(memo, key){
    return xf(memo, [key, lookup(self, key)]);
  }, init, p.keys(self));
}

function reducekv(self, xf, init){
  return p.reduce(function(memo, key){
    return xf(memo, key, lookup(self, key));
  }, init, p.keys(self));
}

function construction(Type){
  Type.create = constructs(Type);
  Type.from || (Type.from = function(attrs){
    return Object.assign(Object.create(Type.prototype), {attrs: attrs});
  });
}

export function emptyable(Type){
  function empty(){
    return new Type();
  }
  implement(IEmptyableCollection, {empty}, Type);
}

export default does(
  construction,
  emptyable,
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IEquiv, {equiv}),
  implement(ICoerceable, {toObject}),
  implement(IEmptyableCollection, {empty}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IMap, {dissoc, keys, vals}),
  implement(ISeq, {first, rest}),
  implement(ICounted, {count}),
  implement(ISeqable, {seq}));
