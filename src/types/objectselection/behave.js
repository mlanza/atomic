import {implement} from '../../protocol';
import {identity, constantly, juxt, reduce, EMPTY_OBJECT} from '../../core';
import {objectSelection} from '../../types/objectselection/construct';
import ICollection from '../../protocols/icollection';
import IReduce from '../../protocols/ireduce';
import IKVReduce from '../../protocols/ikvreduce';
import INext from '../../protocols/inext';
import IArr from '../../protocols/iarr';
import ISeq from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import ICounted from '../../protocols/icounted';
import ILookup from '../../protocols/ilookup';
import IFn from '../../protocols/ifn';
import IMap from '../../protocols/imap';
import ICloneable from '../../protocols/icloneable';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import {lazySeq} from '../../types/lazyseq/construct';

function lookup(self, key){
  return self.keys.indexOf(key) > -1 ? self.obj[key] : null;
}

function _dissoc(self, key){
  const keys = toArray(self.keys).filter(function(k){
    return k !== key;
  });
  return objectSelection(self,  keys);
}

function seq(self){
  const key = ISeq.first(self.keys);
  return lazySeq([key, self.obj[key]], function(){
    return objectSelection(self.obj, ISeq.rest(self.keys));
  });
}

function count(self){
  return self.keys.length;
}

function clone(self){
  return reduce(IArr.toArray(seq(self)), function(memo, pair){
    memo[pair[0]] = pair[1];
    return memo;
  }, {});
}

function _reduce(self, xf, init){
  let memo = init;
  Object.keys(obj).forEach(function(key){
    memo = xf(memo, [key, self.obj[key]]);
  });
  return memo;
}

function _reducekv(self, xf, init){
  let memo = init;
  self.keys.forEach(function(key){
    memo = xf(memo, key, self.obj[key]);
  });
  return memo;
}

function show(self){
  const pairs = IArr.toArray(seq(self));
  return "#object-selection {" + pairs.map(function(pair){
    return show(pair[0]) + ": " + show(pair[1]);
  }).join(", ") + "}";
}

export default juxt(
  implement(IMap, {_dissoc: _dissoc}),
  implement(IReduce, {_reduce: _reduce}),
  implement(IKVReduce, {_reducekv: _reducekv}),
  implement(ICloneable, {clone: clone}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_OBJECT)}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup: lookup}),
  implement(ISeqable, {seq: seq}),
  implement(ICounted, {count: count}),
  implement(IShow, {show: show}));