import unbind from '../unbind.js';
import {flip, identity, add, slice} from '../core.js';
import {extend} from '../protocol';
import Next from '../protocols/next';
import Seq from '../protocols/seq';
import Counted from '../protocols/counted';
import Indexed from '../protocols/indexed';
import Reduce from '../protocols/reduce';
import Seqable from '../protocols/seqable';
import Emptyable from '../protocols/emptyable';
import Lookup from '../protocols/lookup';
import Associative from '../protocols/associative';
import Collection from '../protocols/collection';
import Deref from '../protocols/deref';

export const trim        = unbind(String.prototype.trim);
export const toLowerCase = unbind(String.prototype.toLowerCase);
export const toUpperCase = unbind(String.prototype.toUpperCase);
export const split       = unbind(String.prototype.split);
export const replace     = unbind(String.prototype.replace);
export const substring   = unbind(String.prototype.substring);
export const startsWith  = unbind(String.prototype.startsWith);
export const endsWith    = unbind(String.prototype.endsWith);

export function concat(){
  return reduce(arguments, conj, "");
}

function empty(){
  return "";
}

function first(self){
  return self[0];
}

function rest(self){
  return slice(self, 1);
}

function next(self){
  return self.length < 2 ? null : rest(self);
}

function count(self){
  return self.length;
}

function nth(self, n){
  return self[n] || null;
}

function reduce(self, f, init) {
  var memo = init, len = self.length;
  for(var i = self.start; i < len; i++) {
    if (memo instanceof Reduced)
      break;
    memo = f(memo, self[i]);
  }
  return Deref.deref(memo);
}

function seq(self){
  return self.length ? self : null;
}

function hasKey(self, key){
  return key > -1 && key < self.length;
}

function assoc(self, key, value){
  var arr = slice(self);
  arr.splice(key, 1, value);
  return arr;
}

extend(Lookup, String, {
  get: nth
});

extend(Collection, String, {
  conj: add,
  cons: flip(add)
});

extend(Associative, String, {
  assoc: assoc,
  hasKey: hasKey
});

extend(Emptyable, String, {
  empty: empty
});

extend(Seqable, String, {
  seq: seq
});

extend(Next, String, {
  next: next
});

extend(Seq, String, {
  first: first,
  rest: rest
});

extend(Counted, String, {
  count: count
});

extend(Indexed, String, {
  nth: nth
});

extend(Reduce, String, {
  reduce: reduce
});

export default String;