import {implement} from '../../protocol';
import {EMPTY_OBJECT, constantly, juxt} from '../../core';
import {objectSelection} from '../../types/objectselection';
import {lazySeq} from '../../types/lazyseq';
import {EMPTY} from '../../types/empty/construct';
import IReduce from '../../protocols/ireduce';
import IKVReduce from '../../protocols/ikvreduce';
import ISeqable from '../../protocols/iseqable';
import IShow from '../../protocols/ishow';
import ICounted from '../../protocols/icounted';
import IAssociative from '../../protocols/iassociative';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import ILookup from '../../protocols/ilookup';
import IFn from '../../protocols/ifn';
import IMap from '../../protocols/imap';
import ISeq from "../../protocols/iseq";
import ICloneable from "../../protocols/icloneable";

function lookup(self, key){
  return self[key];
}

function seqObject(self, keys){
  var key = ISeq.first(keys);
  return ISeqable.seq(keys) ? lazySeq([key, self[key]], function(){
    return seqObject(self, ISeq.rest(keys));
  }) : EMPTY;
}

function _dissoc(obj, key){
  const result = Object.assign({}, obj);
  delete result[key];
  return result;
}

function assoc(self, key, value){
  const obj = Object.assign({}, self);
  obj[key] = value;
  return obj;
}

function contains(self, key){
  return self.hasOwnProperty(key);
}

function seq(self){
  return seqObject(self, Object.keys(self));
}

function count(self){
  return ICounted.count(Object.keys(self));
}

function clone(self){
  return Object.assign({}, self);
}

function _reduce(self, xf, init){
  let memo = init;
  Object.keys(self).forEach(function(key){
    memo = xf(memo, [key, self[key]]);
  });
  return memo;
}

function _reducekv(self, xf, init){
  let memo = init;
  Object.keys(self).forEach(function(key){
    memo = xf(memo, key, self[key]);
  });
  return memo;
}

function show(self){
  const xs = ISeq.toArray(seq(self));
  return "{" + xs.map(function(pair){
    return show(pair[0]) + ": " + show(pair[1]);
  }).join(", ") + "}";
}

export default juxt(
  implement(ICloneable, {clone: clone}),
  implement(IReduce, {_reduce: _reduce}),
  implement(IKVReduce, {_reducekv: _reducekv}),
  implement(IMap, {_dissoc: _dissoc}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup: lookup}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_OBJECT)}),
  implement(IAssociative, {assoc: assoc, contains: contains}),
  implement(ISeqable, {seq: seq}),
  implement(ICounted, {count: count}),
  implement(IShow, {show: show}));