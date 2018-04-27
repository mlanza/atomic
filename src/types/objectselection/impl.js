import {implement} from '../../protocol';
import {identity, constantly, doto, EMPTY_OBJECT} from '../../core';
import ObjectSelection, {objectSelection} from '../../types/objectselection/construct';
import ICollection from '../../protocols/icollection';
import INext from '../../protocols/inext';
import ISeq from '../../protocols/iseq';
import ISeqable from '../../protocols/iseqable';
import IIndexed from '../../protocols/iindexed';
import IShow from '../../protocols/ishow';
import ICounted from '../../protocols/icounted';
import ILookup from '../../protocols/ilookup';
import IFn from '../../protocols/ifn';
import IMap from '../../protocols/imap';
import IEmptyableCollection from '../../protocols/iemptyablecollection';
import {lazySeq} from '../../types/lazyseq/construct';
import {toArraySeq} from "../../common";

function lookup(self, key){
  return self.keys.indexOf(key) > -1 ? self.obj[key] : null;
}

function _dissoc(self, key){
  const keys = toArray(self.keys).filter(function(k){
    return k !== key;
  });
  return objectSelection(self,  keys);
}

function first(self){
  const key = ISeq.first(self.keys);
  return [key, self.obj[key]];
}

function rest(self){
  return objectSelection(self.obj, ISeq.rest(self.keys));
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

function show(self){
  const pairs = ISeq.toArray(seq(self));
  return "#object-selection {" + pairs.map(function(pair){
    return show(pair[0]) + ": " + show(pair[1]);
  }).join(", ") + "}";
}

doto(ObjectSelection,
  implement(IMap, {_dissoc: _dissoc}),
  implement(ISeq, {first: first, rest: rest, toArray: toArraySeq}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_OBJECT)}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup: lookup}),
  implement(ISeqable, {seq: seq}),
  implement(ICounted, {count: count}),
  implement(IShow, {show: show}));