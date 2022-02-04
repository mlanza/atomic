import {does, constructs} from "../../core.js";
import {implement} from "../protocol.js";
import {reduced} from "../reduced/construct.js";
import {is} from "../../protocols/imapentry/concrete.js";
import {IReducible, IKVReducible, IEquiv, ICoercible, IAssociative, ISeqable, ILookup, ICounted, IMap, ISeq, IEmptyableCollection} from "../../protocols.js";
import * as p from "./protocols.js";

function coerce(self, Type){
  return is(Type, Object) ? self.attrs : p.coerce(self.attrs, Type);
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
  return Object.assign(p.clone(self), {attrs: p.assoc(self.attrs, key, value)});
}

function dissoc(self, key){
  return Object.assign(p.clone(self), {attrs: p.dissoc(self.attrs, key)});
}

function equiv(self, other){
  return p.count(self) === p.count(other) && reducekv(self, function(memo, key, value){
    return memo ? p.equiv(p.get(other, key), value) : reduced(memo);
  }, true);
}

function empty(self){
  return Object.assign(p.clone(self), {attrs: {}});
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

export function construct(Type){
  return function record(attrs){
    return Object.assign(Object.create(Type.prototype), {attrs: attrs});
  }
}

export function emptyable(Type){
  function empty(){
    return new Type();
  }
  implement(IEmptyableCollection, {empty}, Type);
}

export default does(
  emptyable,
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(IEquiv, {equiv}),
  implement(ICoercible, {coerce}),
  implement(IEmptyableCollection, {empty}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IMap, {dissoc, keys, vals}),
  implement(ISeq, {first, rest}),
  implement(ICounted, {count}),
  implement(ISeqable, {seq}));
