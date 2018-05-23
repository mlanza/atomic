import {implement} from '../protocol';
import {identity, constantly, effect} from '../../core';
import {objectSelection} from '../../types/objectselection/construct';
import {IObj, IElementEmbeddable, IFind, ICollection, IReduce, IKVReduce, INext, IArr, ISeq, ISeqable, IIndexed, IShow, ICounted, ILookup, IFn, IMap, ICloneable, IEmptyableCollection} from '../../protocols';
import {lazySeq} from '../../types/lazyseq/construct';
import {EMPTY_OBJECT} from '../../types/object/construct';
import * as t from '../../types/reduced';
import {equivalence} from '../../types/array/behave';

function embedIn(self, parent){
  IKVReduce._reducekv(self, function(memo, key, value){
    const f = typeof value === "function" ? memo.addEventListener : memo.setAttribute;
    f.call(parent, key, value);
    return memo;
  }, parent, self);
}

function toObject(self){
  return t.reduce(self.keys, function(memo, key){
    memo[key] = lookup(self, key);
    return memo;
  }, {});
}

function find(self, key){
  return self.keys.indexOf(key) > -1 ? [key, self.obj[key]] : null;
}

function lookup(self, key){
  return self.keys.indexOf(key) > -1 ? self.obj[key] : null;
}

function dissoc(self, key){
  const keys = toArray(self.keys).filter(function(k){
    return k !== key;
  });
  return objectSelection(self,  keys);
}

function keys(self){
  return self.keys;
}

function vals(self){
  const key = ISeq.first(self.keys);
  return lazySeq(self.obj[key], function(){
    return vals(objectSelection(self.obj, ISeq.rest(self.keys)));
  });
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
  return t.reduce(IArr.toArray(seq(self)), function(memo, pair){
    memo[pair[0]] = pair[1];
    return memo;
  }, {});
}

function reduce(self, xf, init){
  return t.reduce(Object.keys(obj), function(memo, key){
    return xf(memo, [key, self.obj[key]]);
  }, init);
}

function reducekv(self, xf, init){
  return t.reduce(self.keys, function(memo, key){
    return xf(memo, key, self.obj[key]);
  }, init);
}

function show(self){
  const pairs = IArr.toArray(seq(self));
  return "#object-selection {" + pairs.map(function(pair){
    return show(pair[0]) + ": " + show(pair[1]);
  }).join(", ") + "}";
}

export default effect(
  equivalence,
  implement(IElementEmbeddable, {embedIn}),
  implement(IObj, {toObject}),
  implement(IFind, {find}),
  implement(IMap, {dissoc, keys, vals}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(ICloneable, {clone}),
  implement(IEmptyableCollection, {empty: constantly(EMPTY_OBJECT)}),
  implement(IFn, {invoke: lookup}),
  implement(ILookup, {lookup}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}),
  implement(IShow, {show}));