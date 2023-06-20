import {does, constructs} from "../../core.js";
import {implement} from "../protocol.js";
import {reduced} from "../reduced/construct.js";
import {is} from "../../protocols/imapentry/concrete.js";
import {IReducible, IKVReducible, IEquiv, IAssociative, ISeqable, ILookup, ICounted, IMap, ISeq, IEmptyableCollection} from "../../protocols.js";
import * as p from "./protocols.js";

function contains(self, key){
  return self.hasOwnProperty(key);
}

function lookup(self, key){
  return self[key];
}

function seq(self){
  return p.count(self) ? p.seq(Object.entries(self)) : null;
}

function count(self){
  return p.count(keys(self));
}

function first(self){
  return p.first(seq(self));
}

function rest(self){
  return p.rest(seq(self));
}

function keys(self){
  return Object.keys(self);
}

function vals(self){
  return Object.values(self);
}

function assoc(self, key, value){
  const copy = p.clone(self);
  copy[key] = value;
  return copy;
}

function dissoc(self, key){
  const copy = p.clone(self);
  delete copy[key];
  return copy;
}

function equiv(self, other){
  return p.count(self) === p.count(other) && reducekv(self, function(memo, key, value){
    return memo ? p.equiv(p.get(other, key), value) : reduced(memo);
  }, true);
}

function reduce(self, f, init){
  return p.reduce(function(memo, key){
    return f(memo, [key, lookup(self, key)]);
  }, init, p.keys(self));
}

function reducekv(self, f, init){
  return p.reduce(function(memo, key){
    return f(memo, key, lookup(self, key));
  }, init, p.keys(self));
}

export function construct(Type, attrs){
  return Object.assign(new Type(), attrs);
}

export function emptyable(Type){
  function empty(){
    return new Type();
  }
  implement(IEmptyableCollection, {empty}, Type);
}

const behave = does(
  emptyable,
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(IEquiv, {equiv}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IMap, {dissoc, keys, vals}),
  implement(ISeq, {first, rest}),
  implement(ICounted, {count}),
  implement(ISeqable, {seq}));

export default function(Type){
  behave(Type);
  return constructs(Type);
}
