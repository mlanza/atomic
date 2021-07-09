import {identity, overload, doto, complement} from "../../core.js";
import {implement, satisfies, packs as does} from "../protocol.js";
import {IMergable, IBlankable, IMap, ICoercible, IFunctor, IInsertable, IOmissible, IReversible, IMapEntry, IEquiv, IReduce, IKVReduce, IAppendable, IPrependable, IInclusive, ICollection, INext, ISeq, IFind, ISeqable, IIndexed, IAssociative, ISequential, IEmptyableCollection, IFn, ICounted, ILookup, IClonable} from "../../protocols.js";
import {reduced, unreduced, isReduced} from "../reduced.js";
import {indexedSeq} from "../indexed-seq.js";
import {replace} from "../string/concrete.js";
import {range} from "../range/construct.js";
import iemptylist from "../empty-list/behave.js";
import {concat} from "../concatenated/construct.js";
import {revSeq} from "../rev-seq.js";
import {filter, mapa} from "../lazy-seq.js";
import {emptyArray} from "./construct.js";
import {naming} from "../../protocols/inamable/concrete.js";
import Symbol from "symbol";

const clone = Array.from;

function _before(self, reference, inserted){
  const pos = self.indexOf(reference);
  pos === -1 || self.splice(pos, 0, inserted);
}

function before(self, reference, inserted){
  let arr = Array.from(self);
  _before(arr, reference, inserted);
  return arr;
}

function _after(self, reference, inserted){
  const pos = self.indexOf(reference);
  pos === -1 || self.splice(pos + 1, 0, inserted);
}

function after(self, reference, inserted){
  let arr = Array.from(self);
  _after(arr, reference, inserted);
  return arr;
}

function keys(self){
  return range(count(self));
}

function _dissoc(self, idx){
  self.splice(idx, 1);
}

function dissoc(self, idx){
  let arr = Array.from(self);
  _dissoc(arr, idx);
  return arr;
}

function reduce(xs, xf, init){
  let memo = init, to = xs.length - 1;
  for(let i = 0; i <= to; i++){
    if (isReduced(memo))
      break;
    memo = xf(memo, xs[i]);
  }
  return unreduced(memo);
}

function reducekv(xs, xf, init){
  let memo = init, len = xs.length;
  for(let i = 0; i < len; i++){
    if (isReduced(memo))
      break;
    memo = xf(memo, i, xs[i]);
  }
  return unreduced(memo);
}

function omit(self, value){
  return filter(function(x){
    return x !== value;
  }, self);
}

function reverse(self){
  let c = count(self);
  return c > 0 ? revSeq(self, c - 1) : null;
}

function key(self){
  return self[0];
}

function val(self){
  return self[1];
}

function find(self, key){
  return contains(self, key) ? [key, lookup(self, key)] : null;
}

function lookup(self, key){
  return key in self ? self[key] : null;
}

function assoc(self, key, value){
  if (lookup(self, key) === value) {
    return self;
  }
  const arr = Array.from(self);
  arr.splice(key, 1, value);
  return arr;
}

function contains(self, key){
  return key > -1 && key < self.length;
}

function seq(self){
  return self.length ? self : null;
}

function unconj(self, x){
  let arr = Array.from(self);
  const pos = arr.lastIndexOf(x);
  arr.splice(pos, 1);
  return arr;
}

function append(self, x){
  return self.concat([x]);
}

function prepend(self, x){
  return [x].concat(self);
}

function next(self){
  return self.length > 1 ? rest(self) : null;
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

function count(self){
  return self.length;
}

const nth = lookup;

function idx(self, x){
  const n = self.indexOf(x);
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

const blank = complement(seq);

export const iindexed = does(
  implement(IIndexed, {nth, idx}),
  implement(ICounted, {count}));

export default does(
  naming(?, Symbol("Array")),
  iindexed,
  implement(IEquiv, iemptylist),
  implement(ISequential),
  implement(IMap, {dissoc, keys, vals: identity}),
  implement(IMergable, {merge: concat}),
  implement(IInsertable, {before, after}),
  implement(IFunctor, {fmap}),
  implement(ICoercible, {toObject, toArray: identity}),
  implement(IOmissible, {omit}),
  implement(IReversible, {reverse}),
  implement(IFind, {find}),
  implement(IMapEntry, {key, val}),
  implement(IInclusive, {includes}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(IClonable, {clone}),
  implement(IFn, {invoke: lookup}),
  implement(IEmptyableCollection, {empty: emptyArray}),
  implement(IReduce, {reduce}),
  implement(IKVReduce, {reducekv}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(IBlankable, {blank}),
  implement(ISeqable, {seq}),
  implement(ICollection, {conj: append, unconj}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}));
