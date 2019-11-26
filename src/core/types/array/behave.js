import {does, identity, overload, doto, complement} from '../../core';
import {implement, specify, satisfies} from '../protocol';
import {IMergeable, IBlankable, IMap, IQueryable, IWrite, ICoerce, IFunctor, IInsertable, IYankable, IReversible, ISet, IMapEntry, IEquiv, IReduce, IKVReduce, IAppendable, IPrependable, IInclusive, ICollection, INext, ISeq, IFind, ISeqable, IIndexed, IAssociative, ISequential, IEmptyableCollection, IFn, ICounted, ILookup, ICloneable} from '../../protocols';
import {reduced, unreduced, isReduced} from '../reduced';
import {indexedSeq} from '../indexed-seq';
import {replace} from '../string/concrete';
import {range} from '../range/construct';
import {concat} from "../concatenated/construct";
import {revSeq} from '../rev-seq';
import {filter, mapa} from '../lazy-seq';
import {emptyArray} from './construct';

const clone = Array.from;

function _before(self, reference, inserted){
  const pos = self.indexOf(reference);
  pos === -1 || self.splice(pos, 0, inserted);
}

function before(self, reference, inserted){
  var arr = Array.from(self);
  _before(arr, reference, inserted);
  return arr;
}

function _after(self, reference, inserted){
  const pos = self.indexOf(reference);
  pos === -1 || self.splice(pos + 1, 0, inserted);
}

function after(self, reference, inserted){
  var arr = Array.from(self);
  _after(arr, reference, inserted);
  return arr;
}

function keys(self){
  return range(ICounted.count(self));
}

function _dissoc(self, idx){
  self.splice(idx, 1);
}

function dissoc(self, idx){
  var arr = Array.from(self);
  _dissoc(arr, idx);
  return arr;
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

function disj(self, value){
  return self.filter(function(x){
    return value !== value;
  });
}

function key(self){
  return self[0];
}

function val(self){
  return self[1];
}

function equiv(self, other){
  return other != null && self !== other && IKVReduce.reducekv(self, function(memo, key, value){
    return memo ? IEquiv.equiv(value, ILookup.lookup(other, key)) : reduced(memo);
  }, satisfies(ICounted, other) && ICounted.count(self) === ICounted.count(other));
}

function find(self, key){
  return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
}

function lookup(self, key){
  return key in self ? self[key] : null;
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

const nth = lookup;

function idx(self, x){
  var n = self.indexOf(x);
  return n === -1 ? null : n;
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

function query(self, pred){
  return filter(pred, self);
}

const blank = complement(seq);

export const iindexed = does(
  implement(IIndexed, {nth, idx}),
  implement(ICounted, {count: length}));

export const iequiv = implement(IEquiv, {equiv});

export const behaveAsArray = does(
  iindexed,
  iequiv,
  implement(IQueryable, {query}),
  implement(ISequential),
  implement(IMap, {dissoc, keys, vals: identity}),
  implement(IMergeable, {merge: concat}),
  implement(IInsertable, {before, after}),
  implement(IWrite, {write}),
  implement(IFunctor, {fmap}),
  implement(ICoerce, {toObject}),
  implement(IYankable, {yank}),
  implement(IReversible, {reverse}),
  implement(ISet, {disj}),
  implement(IFind, {find}),
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
  implement(IBlankable, {blank}),
  implement(ISeqable, {seq}),
  implement(ICollection, {conj: append}),
  implement(INext, {next}),
  implement(ICoerce, {toArray: identity}),
  implement(ISeq, {first, rest}));