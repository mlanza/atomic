import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import {emptySet} from "./construct.js";

function transient(self){
  return mut.set(toArray(self));
}

function seq(self){
  return count(self) ? self : null;
}

function toArray(self){
  return self.toArray();
}

function includes(self, value){
  return self.has(value);
}

function conj(self, value){
  return self.add(value);
}

function disj(self, value){
  return self.delete(value);
}

function first(self){
  return self.first();
}

function rest(self){
  let tail = self.rest();
  return tail.size > 0 ? tail : emptySet();
}

function next(self){
  let tail = self.rest();
  return tail.size > 0 ? tail : null;
}

function count(self){
  return self.size;
}

function reduce(self, f, init){
  let memo = init;
  let coll = _.seq(self);
  while(coll){
    memo = f(memo, _.first(coll));
    coll = _.next(coll);
  }
  return _.unreduced(memo);
}

function merge(self, other){
  return reduce(other, _.conj, self);
}

function equiv(self, other){
  return _.count(_.union(self, other)) === count(self);
}

export default _.does(
  _.iterable,
  _.naming("Set"),
  _.implement(_.ISequential),
  _.implement(_.IEquiv, {equiv: equiv}),
  _.implement(_.IAssociative, {contains: includes}),
  _.implement(_.IMergable, {merge}),
  _.implement(mut.ITransient, {transient}),
  _.implement(_.IReduce, {reduce}),
  _.implement(_.ICoercible, {toArray}),
  _.implement(_.ISeqable, {seq}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.ISet, {disj, unite: conj}),
  _.implement(_.IClonable, {clone: _.identity}),
  _.implement(_.IEmptyableCollection, {empty: emptySet}),
  _.implement(_.ICollection, {conj}),
  _.implement(_.ICounted, {count}),
  _.implement(_.INext, {next}),
  _.implement(_.ISeq, {first, rest}))
