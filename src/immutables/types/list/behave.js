import * as _ from "atomic/core";

function equiv(self, other){
  return self.equals(other);
}

function includes(self, value){
  return self.includes(value);
}

function lookup(self, idx){
  return self.get(idx);
}

function assoc(self, idx, value){
  return self.set(idx, value);
}

function contains(self, idx){
  return self.has(idx);
}

function conj(self, value){
  return self.push(value);
}

function first(self){
  return self.first();
}

function rest(self){
  return self.rest();
}

function empty(self){
  return self.clear();
}

function count(self){
  return self.count();
}

function seq(self){
  return self.size ? self : null
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
  return _.reduce(_.conj, self, other);
}

export default _.does(
  _.iterable,
  _.keying("List"),
  _.implement(_.IEquiv, {equiv}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.IAssociative, {assoc, contains}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IReducible, {reduce}),
  _.implement(_.IMergable, {merge}),
  _.implement(_.IEmptyableCollection, {empty}),
  _.implement(_.ICloneable, {clone: _.identity}),
  _.implement(_.ISeqable, {seq}),
  _.implement(_.ICounted, {count}),
  _.implement(_.ICollection, {conj}),
  _.implement(_.ISeq, {first, rest}));
