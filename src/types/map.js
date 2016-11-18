import {constantly} from '../core';
import {extend} from '../protocol';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Associative from '../protocols/associative';
import Reduce from '../protocols/reduce';
import Lookup from '../protocols/lookup';
import Emptyable from '../protocols/emptyable';
import Collection from '../protocols/collection';
import Append from '../protocols/append';
import Counted from '../protocols/counted';

function seq(self){
  return self.size ? new LazyList(first(self), function(){
    return seq(rest(self));
  }) : null;
}

function reduce(self, f, init){
  return Reduce.reduce(seq(self), f, init);
}

function first(self){
  return self.entries().next().value;
}

function rest(self){
  var ents = self.entries();
  ents.next();
  return new Map(ents);
}

function hasKey(self, key){
  return self.has(key);
}

function get(self, key){
  return self.get(key);
}

function count(self){
  return self.size;
}

function assoc(self, key, value){
  var map = new Map(self);
  map.set(key, value);
  return map;
}

function append(self, pair){
  return assoc(self, pair[0], pair[1]);
}

export default extend(Map, Collection, {
  conj: append
}, Append, {
  append: append
}, Counted, {
  count: count
}, Reduce, {
  reduce: reduce
}, Emptyable, {
  empty: constantly({})
}, Seqable, {
  seq: seq
}, Lookup, {
  get: get
}, Associative, {
  hasKey: hasKey,
  assoc: assoc,
});