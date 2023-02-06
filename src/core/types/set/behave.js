import {identity, overload, doto, complement, does, slice} from "../../core.js";
import {implement, satisfies} from "../protocol.js";
import {IHashable, ISet, IMergable, IMap, IEquiv, IReducible, IInclusive, ICollection, INext, ISeq, IFind, ISeqable, IIndexed, ISequential, IEmptyableCollection, ICounted, IClonable} from "../../protocols.js";
import {reduced, unreduced, isReduced} from "../reduced.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {hashSeq as hash} from "../../protocols/ihashable/hashers.js";
import {set, emptySet} from "./construct.js";

function seq(self){
  return count(self) ? self : null;
}

function empty(self){
  return emptySet();
}

function disj(self, value){
  const s = clone(self);
  s.delete(value);
  return s;
}

function includes(self, value){
  return self.has(value);
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
  return _.lazyIterable(iter);
}

function next(self){
  const iter = self.values();
  iter.next();
  return _.lazyIterable(iter, null);
}

function count(self){
  return self.size;
}

function clone(self){
  return new self.constructor(Array.from(self));
}

function reduce(self, f, init){
  let memo = init;
  let coll = seq(self);
  while(coll){
    memo = f(memo, ISeq.first(coll));
    coll = INext.next(coll);
  }
  return _.unreduced(memo);
}

function merge(self, other){
  return set([...self, ...other]);
}

function equiv(self, other){
  return count(self) === count(other) && reduce(self, function(memo, value){
    return memo && includes(other, value) ? true : reduced(false);
  }, true);
}

export default does(
  keying("Set"),
  implement(ISequential),
  implement(IEquiv, {equiv}),
  implement(IMergable, {merge}),
  implement(IHashable, {hash}),
  implement(IReducible, {reduce}),
  implement(ISeqable, {seq}),
  implement(IInclusive, {includes}),
  implement(IClonable, {clone}),
  implement(ICounted, {count}),
  implement(INext, {next}),
  implement(ISeq, {first, rest}),
  implement(IEmptyableCollection, {empty}),
  implement(ICollection, {conj}),
  implement(ISet, {disj}));
