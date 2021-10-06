import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {lazySeq} from "../../types/lazy-seq/construct.js";
import {cons} from "../../types/list/construct.js";
import {remove, into} from "../../types/lazy-seq/concrete.js";
import {emptyObject} from "../../types/object/construct.js";
import {iequiv} from "../../types/empty-list/behave.js";
import {IEquiv, ICoercible, IFind, IReduce, IKVReduce, ISeqable, ICounted, ILookup, IFn, IMap, IClonable, IEmptyableCollection} from "../../protocols.js";
import * as p from "./protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";
import Symbol from "symbol";

function toObject(self){
  return into({}, self);
}

function find(self, key){
  return p.includes(p.keys(self), key) ? [key, p.get(self.obj, key)] : null;
}

function lookup(self, key){
  return p.includes(p.keys(self), key) ? self.obj[key] : null;
}

function dissoc(self, key){
  return new self.constructor(self, remove(function(k){
    return k === key;
  }, self.keys));
}

function keys(self){
  return self.keys;
}

function vals(self){
  const key = p.first(self.keys);
  return lazySeq(function(){
    return cons(lookup(self, key), vals(new self.constructor(self.obj, p.rest(self.keys))));
  });
}

function seq(self){
  const key = p.first(self.keys);
  return lazySeq(function(){
    return cons([key, lookup(self, key)], new self.constructor(self.obj, p.rest(self.keys)));
  });
}

function count(self){
  return p.count(self.keys);
}

function clone(self){
  return toObject(self);
}

function reduce(self, f, init){
  return p.reduce(function(memo, key){
    return f(memo, [key, lookup(self, key)]);
  }, init, keys(self));
}

function reducekv(self, f, init){
  return p.reduce(function(memo, key){
    return f(memo, key, lookup(self, key));
  }, init, keys(self));
}

export default does(
  iequiv,
  naming(?, Symbol("AssociativeSubset")),
  implement(ICoercible, {toObject}),
  implement(IFind, {find}),
  implement(IMap, {dissoc, keys, vals}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IClonable, {clone}),
  implement(IEmptyableCollection, {empty: emptyObject}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}));
