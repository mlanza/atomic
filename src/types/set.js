import {constantly} from '../core';
import {extend} from '../protocol';
import Seq from '../protocols/seq';
import Seqable from '../protocols/seqable';
import Counted from '../protocols/counted';
import Indexed from '../protocols/indexed';
import Reduce from '../protocols/reduce';
import Emptyable from '../protocols/emptyable';
import Lookup from '../protocols/lookup';
import Collection from '../protocols/collection';
import Reduced from '../types/reduced';

function first(self){
  return self.values().next().value;
}

function rest(self){
  var vals = self.values();
  vals.next();
  return new Set(vals);
}

function seq(self){
  return self.size === 0 ? null : self;
}

function count(self){
  return self.size;
}

function nth(self, n){
  return n ? nth(rest(self), n - 1) : first(self);
}

function conj(self, value){
  var set = new Set(self);
  set.add(value);
  return set;
}

function get(self, value){
  return self.has(value) ? value : null;
}

function reduce(self, f, init){ //TODO make default if for..of well supported
  var memo = init;
  for(var value of self){
    if (memo instanceof Reduced) break;
    memo = f(memo, value);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function set(coll){
  return new Set(coll);
}

export function disj(self){
  var set = new Set(self);
  set.delete(key);
  return set;
}

export default extend(Set, Collection, {
  conj: conj
}, Lookup, {
  get: nth
}, Emptyable, {
  empty: constantly(new Set())
}, Seqable, {
  seq: seq
}, Seq, {
  first: first,
  rest: rest
}, Counted, {
  count: count
}, Indexed, {
  nth: nth
}, Reduce, {
  reduce: reduce
});