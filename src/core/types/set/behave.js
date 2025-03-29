import {identity, overload, doto, complement, does, slice} from "../../core.js";
import {implement, satisfies} from "../protocol.js";
import {IFunctor, IFn, ILookup, IHashable, ISet, IMergable, IMap, IEquiv, IReducible, IKVReducible, IInclusive, ICollection, ISeq, IFind, ISeqable, IIndexed, ISequential, IEmptyableCollection, ICounted, ICloneable} from "../../protocols.js";
import {reduced} from "../reduced.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {hashSeq as hash} from "../../protocols/ihashable/hashers.js";
import {lazyIterable, mapa, mapIndexed} from "../lazy-seq/concrete.js";
import {iterable, reductive} from "../lazy-seq/behave.js";
import {iequiv} from "../empty-list/behave.js";
import * as p from "../../protocols/concrete.js";
import {reduce, reducekv} from "../../shared.js";

function seq(self){
  return count(self) ? self : null;
}

function empty(self){
  return new self.constructor([]);
}

function disj(self, value){
  const s = clone(self);
  s.delete(value);
  return s;
}

function includes(self, value){
  return self.has(value);
}

function lookup(self, value){
  return self.has(value) ? value : null;
}

function conj(self, value){
  const s = clone(self);
  s.add(value);
  return s;
}

function first(self){
  return self.values().next().value;
}

function rest(self){
  const iter = self.values();
  iter.next();
  return lazyIterable(iter);
}

function count(self){
  return self.size;
}

function clone(self){
  return new self.constructor(Array.from(self));
}

function merge(self, other){
  return new self.constructor([...self, ...other]);
}

function equiv(self, other){
  return p.count(self) === p.count(other) && p.reduce(function(memo, value){
    return memo && p.includes(other, value) ? true : reduced(false);
  }, true, self);
}

function fmap(self, f){
  return new Set(mapa(f, self));
}

export default does(
  keying("Set"),
  iterable,
  reductive,
  implement(ISequential),
  implement(IEquiv, {equiv}),
  implement(IMergable, {merge}),
  implement(IHashable, {hash}),
  implement(IReducible, {reduce}),
  implement(IKVReducible, {reducekv}),
  implement(ISeqable, {seq}),
  implement(ILookup, {lookup}),
  implement(IFn, {invoke: lookup}),
  implement(IFunctor, {fmap}),
  implement(IInclusive, {includes}),
  implement(ICloneable, {clone}),
  implement(ICounted, {count}),
  implement(ISeq, {first, rest}),
  implement(IEmptyableCollection, {empty}),
  implement(ICollection, {conj}),
  implement(ISet, {disj, unite: conj}));
