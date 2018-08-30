import {does, identity, overload, constantly, doto} from '../../core';
import {implement, specify, satisfies} from '../protocol';
import {IMap, ITransient, IPersistent, IWrite, ITemplate, IArray, IObject, IFunctor, IInsertable, IYank, IEncode, IDecode, IReversible, ISet, IMapEntry, IEquiv, IReduce, IKVReduce, IAppendable, IPrependable, IInclusive, ICollection, INext, ISeq, IFind, ISeqable, IIndexed, IAssociative, ISequential, IEmptyableCollection, IFn, ICounted, ILookup, ICloneable} from '../../protocols';
import {reduced, unreduced, isReduced} from '../reduced';
import {indexedSeq} from '../indexed-seq';
import {replace} from '../string/concrete';
import {range} from '../range/construct';
import {revSeq} from '../rev-seq';
import {filter, mapa} from '../lazy-seq/concrete';
import {set} from '../set/construct';
import {transientArray} from '../transient-array/construct';
import Array, {emptyArray} from './construct';
import {_ as v} from "param.macro";

const clone = Array.from;

function transient(self){
  return transientArray(clone(self));
}

function before(self, reference, inserted){
  return IPersistent.persistent(
    doto(transient(self),
      IInsertable.before(v, reference, inserted)));
}

function after(self, reference, inserted){
  return IPersistent.persistent(
    doto(transient(self),
      IInsertable.after(v, reference, inserted)));
}

function fill(self, template){
  return IKVReduce.reducekv(self, function(text, key, value){
    return replace(text, new RegExp("\\{" + key + "\\}", 'ig'), value);
  }, template);
}

function reduce3(xs, xf, init){
  var memo = init, to = xs.length - 1;
  for(var i = 0; i <= to; i++){
    if (isReduced(memo))
      break;
    memo = xf(memo, xs[i]);
  }
  return unreduced(memo);
}

function reduce4(xs, xf, init, from){
  return reduce5(xs, xf, init, from, xs.length - 1);
}

function reduce5(xs, xf, init, from, to){
  var memo = init;
  if (from <= to) {
    for(var i = from; i <= to; i++){
      if (isReduced(memo))
        break;
      memo = xf(memo, xs[i]);
    }
  } else {
    for(var i = from; i >= to; i--){
      if (isReduced(memo))
        break;
      memo = xf(memo, xs[i]);
    }
  }
  return unreduced(memo);
}

const reduce = overload(null, null, null, reduce3, reduce4, reduce5);

function reducekv(xs, xf, init, from){
  var memo = init, len = xs.length;
  for(var i = from || 0; i < len; i++){
    if (isReduced(memo))
      break;
    memo = xf(memo, i, xs[i]);
  }
  return unreduced(memo);
}

function yank(self, value){
  return filter(function(x){
    return x !== value;
  }, self);
}

function reverse(self){
  let c = ICounted.count(self);
  return c > 0 ? revSeq(self, c - 1) : null;
}

function union(xs, ys){
  return set([...xs, ...ys]);
}

function intersection(xs, ys){
  ys = set(ys);
  return xs.filter(function(x){
    return ys.has(x);
  });
}

function difference(xs, ys){
  ys = set(ys);
  return xs.filter(function(x){
    return !ys.has(x);
  });
}

function superset(self, subset){
  return IReduce.reduce(subset, function(memo, value){
    return memo ? IInclusive.includes(self, value) : reduced(memo);
  }, true);
}

function disj(self, value){
  return self.filter(function(x){
    return value !== value;
  });
}

function keys(self){
  return range(ICounted.count(self));
}

function dissoc(self, idx){
  return IPersistent.persistent(
    doto(transient(self),
      IMap.dissoc(v, idx)));
}

function key(self){
  return self[0];
}

function val(self){
  return self[1];
}

function equiv(self, other){
  return self === other ? true : IKVReduce.reducekv(self, function(memo, key, value){
    return memo ? IEquiv.equiv(value, ILookup.lookup(other, key)) : reduced(memo);
  }, ICounted.count(self) === ICounted.count(other));
}

function find(self, key){
  return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
}

function lookup(self, key){
  return self[key];
}

function assoc(self, key, value){
  if (lookup(self, key) === value) {
    return self;
  }
  var arr = Array.from(self);
  arr.splice(key, 1, value);
  return arr;
}

function contains(self, key){
  return key > -1 && key < self.length;
}

function seq(self){
  return self.length ? self : null;
}

function append(self, x){
  return self.concat([x]);
}

function prepend(self, x){
  return [x].concat(self);
}

function next(self){
  return self.length > 1 ? ISeq.rest(self) : null;
}

function first(self){
  return self[0];
}

function rest(self){
  return indexedSeq(self, 1);
}

function includes(self, x){
  return self.indexOf(x) > -1;
}

function length(self){
  return self.length;
}

function nth(coll, idx){
  return coll[idx];
}

function encode(self, label, refstore, seed){
  return reduce(self, function(memo, value){
    memo.push(IEncode.encode(value, label, refstore, seed));
    return memo;
  }, []);
}

function decode(self, label, constructors){
  return reduce(self, function(memo, value){
    memo.push(IDecode.decode(self, label, constructors));
    return memo;
  }, []);
}

function toObject(self){
  return reduce(self, function(memo, [key, value]){
    memo[key] = value;
    return memo;
  }, {});
}

function fmap(self, f){
  return mapa(f, self);
}

function write(self, message){
  self.push(message);
}

export const iindexed = does(
  implement(IIndexed, {nth}),
  implement(ICounted, {count: length}));

export const iequiv = implement(IEquiv, {equiv});
export const itemplate = implement(ITemplate, {fill});

export default does(
  iindexed,
  iequiv,
  itemplate,
  implement(ITransient, {transient}),
  implement(ISequential),
  implement(IInsertable, {before, after}),
  implement(IWrite, {write}),
  implement(IFunctor, {fmap}),
  implement(IEncode, {encode}),
  implement(IDecode, {decode}),
  implement(IObject, {toObject}),
  implement(IYank, {yank}),
  implement(IReversible, {reverse}),
  implement(ISet, {union, intersection, difference, disj, superset}),
  implement(IFind, {find}),
  implement(IMap, {dissoc, keys, vals: identity}),
  implement(IMapEntry, {key, val}),
  implement(IInclusive, {includes}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(ICloneable, {clone}),
  implement(IFn, {invoke: lookup}),
  implement(IEmptyableCollection, {empty: emptyArray}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeqable, {seq}),
  implement(ICollection, {conj: append}),
  implement(INext, {next}),
  implement(IArray, {toArray: identity}),
  implement(ISeq, {first, rest}));