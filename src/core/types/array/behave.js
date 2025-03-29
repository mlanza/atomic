import {identity, overload, complement, does, slice} from "../../core.js";
import {implement, satisfies} from "../protocol.js";
import {IHashable, IMergable, IMap, IFlatMappable, IFunctor, IInsertable, IOmissible, IReversible, IMapEntry, IEquiv, IReducible, IKVReducible, IAppendable, IPrependable, IInclusive, ICollection, ISeq, IFind, ISeqable, IIndexed, IAssociative, ISequential, IEmptyableCollection, IFn, ICounted, ILookup, ICloneable} from "../../protocols.js";
import {reduced, unreduced, isReduced} from "../reduced.js";
import {indexedSeq} from "../indexed-seq.js";
import {replace} from "../string/concrete.js";
import {range} from "../range/construct.js";
import {iequiv} from "../empty-list/behave.js";
import {revSeq} from "../rev-seq.js";
import {filtera, mapa, concat as merge} from "../lazy-seq.js";
import {emptyArray as empty} from "./construct.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {hashSeq as hash} from "../../protocols/ihashable/hashers.js";
import {equiv} from "../../protocols/iequiv/concrete.js";

function clone(self){
  return slice(self)
}

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

function reduce(xs, f, init){
  let memo = init, to = xs.length - 1;
  for(let i = 0; i <= to; i++){
    if (isReduced(memo))
      break;
    memo = f(memo, xs[i]);
  }
  return unreduced(memo);
}

function reducekv(xs, f, init){
  let memo = init, len = xs.length;
  for(let i = 0; i < len; i++){
    if (isReduced(memo))
      break;
    memo = f(memo, i, xs[i]);
  }
  return unreduced(memo);
}

function omit(self, value){
  return filtera(complement(equiv(value, ?)), self);
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
  if (key < 0 || key > count(self)) {
    throw new Error(`Index ${key} out of bounds`);
  }
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
  return [...self, x];
}

function prepend(self, x){
  return [x, ...self];
}

function first(self){
  return self[0];
}

function rest(self){
  return indexedSeq(self, 1);
}

function includes(self, x){
  return self.includes(x);
}

function count(self){
  return self.length;
}

const nth = lookup;

function idx(self, x){
  const n = self.indexOf(x);
  return n === -1 ? null : n;
}

function fmap(self, f){
  return mapa(f, self);
}

export const iindexed = does(
  implement(IIndexed, {nth, idx}),
  implement(ICounted, {count}));

function flat(self){
  return self.flat();
}

function flatMap(self, f){
  return self.flatMap(f);
}

export default does(
  iequiv,
  iindexed,
  keying("Array"),
  implement(ISequential),
  implement(IFlatMappable, {flatMap, flat}),
  implement(IHashable, {hash}),
  implement(IMap, {dissoc, keys, vals: identity}),
  implement(IMergable, {merge}),
  implement(IInsertable, {before, after}),
  implement(IFunctor, {fmap}),
  implement(IOmissible, {omit}),
  implement(IReversible, {reverse}),
  implement(IFind, {find}),
  implement(IMapEntry, {key, val}),
  implement(IInclusive, {includes}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(ICloneable, {clone}),
  implement(IFn, {invoke: lookup}),
  implement(IEmptyableCollection, {empty}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(ISeqable, {seq}),
  implement(ICollection, {conj: append, unconj}),
  implement(ISeq, {first, rest}));
