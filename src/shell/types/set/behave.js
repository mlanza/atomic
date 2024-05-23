import * as _ from "atomic/core";
import {IPersistent, ISet, IEmptyableCollection, ICollection} from "../../protocols.js";

function seq(self){
  return count(self) ? self : null;
}

function empty(self){
  self.clear();
}

function disj(self, value){
  self.delete(value);
}

function includes(self, value){
  return self.has(value);
}

function conj(self, value){
  self.add(value);
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
  return new self.constructor(_.toArray(self));
}

function reduce(self, f, init){
  let memo = init;
  let coll = seq(self);
  while(coll){
    memo = f(memo, first(coll));
    coll = next(coll);
  }
  return _.unreduced(memo);
}

export default _.does(
  _.keying("Set"),
  _.implement(_.ISequential),
  _.implement(_.IReducible, {reduce}),
  _.implement(_.ISeqable, {seq}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.ICloneable, {clone}),
  _.implement(_.ICounted, {count}),
  _.implement(_.INext, {next}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(IEmptyableCollection, {empty}),
  _.implement(ICollection, {conj}),
  _.implement(ISet, {disj})); //TODO unite
