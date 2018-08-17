import {constantly, effect, identity} from '../../core';
import {implement} from '../protocol';
import {ITransient, IComparable, IYank, IMatch, IArray, IDecode, ISet, INext, ICollection, IEncode, IEquiv, IMapEntry, IReduce, IKVReduce, ISeqable, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, IFn, IMap, ISeq, IDescriptive, IObject, ICloneable, IInclusive} from '../../protocols';
import {reduced} from '../reduced';
import {transientObject} from '../transient-object/construct';
import {lazySeq, into, map} from '../lazy-seq';
import {iequiv, itemplate} from '../array/behave';
import {satisfies} from "../protocol/concrete";
import Object, {emptyObject} from '../object/construct';

const keys = Object.keys;
const vals = Object.values;

function transient(self){
  return transientObject(clone(self));
}

function matches(self, template){
  return IKVReduce.reducekv(template, function(memo, key, value){
    return memo ? IEquiv.equiv(ILookup.lookup(self, key), value) : reduced(memo);
  }, true);
}

function yank(self, entry){
  const key = IMapEntry.key(entry),
        val = IMapEntry.val(entry);
  if (includes(self, entry)) {
    const result = clone(self);
    delete result[key];
    return result;
  } else {
    return self;
  }
}

function compare(self, other){ //assume like keys, otherwise use your own comparator!
  return IEquiv.equiv(self, other) ? 0 : satisfies(IDescriptive, other) ? IReduce.reduce(IMap.keys(self), function(memo, key){
    return memo == 0 ? IComparable.compare(ILookup.lookup(self, key), ILookup.lookup(other, key)) : reduced(memo);
  }, 0) : -1;
}

function conj(self, entry){
  const key = IMapEntry.key(entry),
        val = IMapEntry.val(entry);
  const result = ICloneable.clone(self);
  result[key] = val;
  return result;
}

function equiv(self, other){
  return satisfies(IDescriptive, other) && ICounted.count(IMap.keys(self)) === ICounted.count(IMap.keys(other)) && IReduce.reduce(IMap.keys(self), function(memo, key){
    return memo ? IEquiv.equiv(ILookup.lookup(self, key), ILookup.lookup(other, key)) : reduced(memo);
  }, true);
}

function find(self, key){
  return contains(self, key) ? [key, lookup(self, key)] : null;
}

function includes(self, entry){
  const key = IMapEntry.key(entry),
        val = IMapEntry.val(entry);
  return self[key] === val;
}

/*
function superset(self, subset){
  return IKVReduce.reducekv(subset, function(memo, key, value){
    return memo ? IEquiv.equiv(get(self, key), value) : reduced(memo);
  }, true);
}
*/

function lookup(self, key){
  return self[key];
}

function first(self){
  const key = ISeq.first(keys(self));
  return key ? [key, lookup(self, key)] : null;
}

function rest(self){
  return next(self) || {};
}

function next2(self, keys){
  if (ISeqable.seq(keys)) {
    const key = ISeq.first(keys);
    return lazySeq([key, lookup(self, key)], function(){
      return next2(self, INext.next(keys));
    });
  } else {
    return null;
  }
}

function next(self){
  return next2(self, INext.next(keys(self)));
}

function dissoc(self, key){
  if (IAssociative.contains(self, key)) {
    const result = clone(self);
    delete result[key];
    return result;
  } else {
    return self;
  }
}

function assoc(self, key, value){
  if (ILookup.lookup(self, key) === value) {
    return self;
  } else {
    const result = clone(self);
    result[key] = value;
    return result;
  }
}

function contains(self, key){
  return self.hasOwnProperty(key);
}

function seq(self){
  if (!count(self)) return null;
  return map(function(key){
    return [key, lookup(self, key)];
  }, keys(self));
}

function count(self){
  return keys(self).length;
}

function clone(self){
  return Object.assign({}, self);
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

function toArray(self){
  return reduce(self, function(memo, pair){
    memo.push(pair);
    return memo;
  }, []);
}

function encode(self, label, refstore, seed){
 return reducekv(self, function(memo, key, value){
    return IAssociative.assoc(memo, IEncode.encode(key, label, refstore, seed), IEncode.encode(value, label, refstore, seed));
  }, {});
}

function decode(self, label, constructors){
  if (IAssociative.contains(self, label)){
    if (IAssociative.contains(self, "data")) {
      const constructor = ILookup.lookup(constructors, ILookup.lookup(self, label)).from;
      const data = ILookup.lookup(self, "data");
      return constructor(data && data.constructor === Object ? reducekv(data, function(memo, key, value){
        return IAssociative.assoc(memo, IDecode.decode(key, label, constructors), IDecode.decode(value, label, constructors));
      }, {}) : IDecode.decode(data, label, constructors));
    } else {
      throw new Error("Cannot decode reference types.");
    }
  } else {
    return self;
  }
}

export default effect(
  iequiv,
  itemplate,
  implement(IDescriptive),
  implement(ITransient, {transient}),
  implement(IEquiv, {equiv}),
  implement(IDecode, {decode}),
  implement(IEncode, {encode}),
  implement(IArray, {toArray: toArray}),
  implement(IObject, {toObject: identity}),
  implement(IFind, {find}),
  implement(IYank, {yank}),
  implement(IMatch, {matches}),
  //implement(ISet, {superset}),
  implement(IInclusive, {includes}),
  implement(ICollection, {conj}),
  implement(ICloneable, {clone}),
  implement(IComparable, {compare}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(IMap, {dissoc, keys, vals}),
  implement(IFn, {invoke: lookup}),
  implement(ISeq, {first, rest}),
  implement(INext, {next}),
  implement(ILookup, {lookup: lookup}),
  implement(IEmptyableCollection, {empty: emptyObject}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeqable, {seq}),
  implement(ICounted, {count}));