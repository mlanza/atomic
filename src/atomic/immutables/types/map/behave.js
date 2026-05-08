import * as _ from "atomic/core";

function assoc(self, key, value){
  return self.set(key, value);
}

function conj(self, [key, value]){
  return assoc(self, key, value);
}

function contains(self, key){
  return self.has(key);
}

function lookup(self, key){
  return self.get(key);
}

function count(self){
  return self.size;
}

function keys(self){
  return _.lazyIterable(self.keys());
}

function vals(self){
  return _.lazyIterable(self.values());
}

function dissoc(self, key){
  return self.remove(key);
}

function reducekv(self, f, init){
  return _.reduce(function(memo, key){
    return f(memo, key, _.get(self, key));
  }, init, keys(self));
}

function reduce(self, f, init){
  return _.reduce(f, init, seq(self));
}

function merge(self, other){
  return _.reducekv(_.assoc, self, other);
}

function seq(self){
  return self.size ? _.lazyIterable(self.entries()) : null;
}

function first(self){
  return _.first(seq(self));
}

function rest(self){
  return _.rest(seq(self));
}

function equiv(self, other){
  return self.equals(other);
}

export default _.does(
  _.iterable,
  _.keying("Map"),
  _.implement(_.IReducible, {reduce}),
  _.implement(_.IKVReducible, {reducekv}),
  _.implement(_.IEquiv, {equiv}),
  _.implement(_.IMergable, {merge}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(_.ISeqable, {seq}),
  _.implement(_.IMap, {keys, vals, dissoc}),
  _.implement(_.ICloneable, {clone: _.identity}),
  _.implement(_.ICounted, {count}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.ICollection, {conj}),
  _.implement(_.IAssociative, {assoc, contains}));
