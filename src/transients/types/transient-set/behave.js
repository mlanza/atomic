import * as _ from "atomic/core";
import {emptyTransientSet, transientSet} from "./construct.js";
import {IPersistent, ITransientSet, ITransientEmptyableCollection, ITransientCollection} from "../../protocols.js";

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

const toArray = Array.from;

function clone(self){
  return transientSet(toArray(self));
}

function reduce(self, xf, init){
  let memo = init;
  let coll = seq(self);
  while(coll){
    memo = xf(memo, first(coll));
    coll = next(coll);
  }
  return _.unreduced(memo);
}

export default _.does(
  _.implement(_.ISequential),
  _.implement(_.IReduce, {reduce}),
  _.implement(_.ICoercible, {toArray}),
  _.implement(_.ISeqable, {seq}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.IClonable, {clone}),
  _.implement(_.ICounted, {count}),
  _.implement(_.INext, {next}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(ITransientEmptyableCollection, {empty}),
  _.implement(ITransientCollection, {conj}),
  _.implement(ITransientSet, {disj})); //TODO unite
