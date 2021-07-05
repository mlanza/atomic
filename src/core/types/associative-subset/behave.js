import {implement} from "../protocol.js";
import {identity, does} from "../../core.js";
import {IEquiv, ICoerceable, IFind, IReduce, IKVReduce, INext, ISeq, ISeqable, IIndexed, ICounted, ILookup, IFn, IMap, IClonable, IEmptyableCollection} from "../../protocols.js";
import {lazySeq} from "../../types/lazy-seq/construct.js";
import {cons} from "../../types/list/construct.js";
import {remove, into} from "../../types/lazy-seq/concrete.js";
import {emptyObject} from "../../types/object/construct.js";
import iemptylist from "../../types/empty-list/behave.js";

function toObject(self){
  return into({}, self);
}

function find(self, key){
  return IInclusive.includes(IMap.keys(self), key) ? [key, ILookup.lookup(self.obj, key)] : null;
}

function lookup(self, key){
  return IInclusive.includes(IMap.keys(self), key) ? self.obj[key] : null;
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
  const key = ISeq.first(self.keys);
  return lazySeq(function(){
    return cons(lookup(self, key), vals(new self.constructor(self.obj, ISeq.rest(self.keys))));
  });
}

function seq(self){
  const key = ISeq.first(self.keys);
  return lazySeq(function(){
    return cons([key, lookup(self, key)], new self.constructor(self.obj, ISeq.rest(self.keys)));
  });
}

function count(self){
  return ICounted.count(self.keys);
}

function clone(self){
  return toObject(self);
}

function reduce(self, xf, init){
  return IReduce.reduce(keys(self), function(memo, key){
    return xf(memo, [key, lookup(self, key)]);
  }, init);
}

function reducekv(self, xf, init){
  return IReduce.reduce(keys(self), function(memo, key){
    return xf(memo, key, lookup(self, key));
  }, init);
}

export default does(
  implement(IEquiv, iemptylist),
  implement(ICoerceable, {toObject}),
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
