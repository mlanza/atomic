import * as _ from "atomic/core";
import * as $ from "atomic/shell";

function equiv(self, other){
  return other.constructor === URLSearchParams && _.eq(_.into({}, self), _.into({}, other));
}

function clone(self){
  const params = new URLSearchParams();
  for(const [key, value] of self.entries()){
    params.set(key, value);
  }
  return params;
}

function conj(self, [key, value]){
  const other = clone(self);
  other.set(key, value);
  return other;
}

function count(self){
  return self.size;
}

function lookup(self, key){
  return self.get(key);
}

function assoc(self, key, value){
  self.set(key, value);
}

function dissoc(self, key){
  self.delete(key);
}

function seq(self) {
  return count(self) ? self : null;
}

function reduce(self, f, init){
  let memo = init;
  for(const entry of self.entries()){
    if (_.isReduced(memo))
      break;
    memo = f(memo, entry);
  }
  return _.unreduced(memo);
}

function reducekv(self, f, init){
  let memo = init;
  for(const [key, value] of self.entries()){
    if (_.isReduced(memo))
      break;
    memo = f(memo, key, value);
  }
  return _.unreduced(memo);
}

function first(self){
  const ks = keys(self),
        k = _.first(ks);
  return k ? [k, lookup(self, k)] : null;
}

function rest(self){
  const iter = self.entries();
  iter.next();
  return _.lazyIterable(iter);
}

function keys(self){
  return _.lazyIterable(self.keys());
}

function vals(self){
  return _.lazyIterable(self.values());
}

function contains2(self, key){
  return self.has(key);
}

const contains = _.overload(null, _.constantly(_.looseEq), contains2);

function includes(self, [key, value]) {
  return _.contains(self, key, value);
}

export default _.does(
  _.keying("URLSearchParams"),
  _.implement(_.IEquiv, {equiv}),
  _.implement(_.ICloneable, {clone}),
  _.implement(_.ICounted, {count}),
  _.implement(_.ISeqable, {seq}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(_.IMap, {keys, vals}),
  _.implement(_.IInclusive, {includes}),
  _.implement(_.IAssociative, {contains}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IReducible, {reduce}),
  _.implement(_.IKVReducible, {reducekv}),
  _.implement(_.ICollection, {conj}),
  _.implement($.IMap, {dissoc}),
  _.implement($.IAssociative, {assoc}));
