import * as _ from "atomic/core";

function assoc(self, key, value){
  return self.set(key, value);
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
  return self.remove(self, key);
}

function reducekv(self, xf, init){
  return _.reduce(function(memo, key){
    return xf(memo, key, _.get(self, key));
  }, init, keys(self));
}

function toArray(self){
  return self.toArray();
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

function next(self){
  return _.seq(rest(self));
}

export default _.does(
  _.iterable,
  _.implement(_.IKVReduce, {reducekv}),
  _.implement(_.ICoercible, {toArray}),
  _.implement(_.IMergable, {merge}),
  _.implement(_.INext, {next}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(_.ISeqable, {seq}),
  _.implement(_.IMap, {keys, vals, dissoc}),
  _.implement(_.IClonable, {clone: _.identity}),
  _.implement(_.ICounted, {count}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IAssociative, {assoc, contains}));
