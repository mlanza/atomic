import unbind from '../unbind.js';
import {flip, identity, add, first, rest, slice} from '../core.js';
import {extend} from '../protocol';
import {indexedSeq} from '../types/indexed-seq';
import Trim from '../protocols/trim';
import Next from '../protocols/next';
import Seq from '../protocols/seq';
import Counted from '../protocols/counted';
import Indexed from '../protocols/indexed';
import Reduce from '../protocols/reduce';
import Seqable from '../protocols/seqable';
import Emptyable from '../protocols/emptyable';
import Lookup from '../protocols/lookup';
import Associative from '../protocols/associative';
import {deref} from '../protocols/deref';

export const trim        = unbind(String.prototype.trim);
export const toLowerCase = unbind(String.prototype.toLowerCase);
export const toUpperCase = unbind(String.prototype.toUpperCase);
export const split       = flip(unbind(String.prototype.split), 2);
export const replace     = flip(unbind(String.prototype.replace), 3);
export const substring   = flip(unbind(String.prototype.substring), 3);
export const startsWith  = flip(unbind(String.prototype.startsWith), 2);
export const endsWith    = flip(unbind(String.prototype.endsWith), 2);
export const append      = add;

export function concat(){
  return reduce(slice(arguments), add, "");
}

export function empty(){
  return "";
}

export function next(self){
  return self.length < 2 ? null : indexedSeq(self, 1);
}

export function first(self){
  return self[0];
}

export function rest(self){
  return indexedSeq(self, 1);
}

export function count(self){
  return self.length;
}

export function nth(self, n){
  return self[n] || null;
}

export function reduce(self, f, init) {
  var memo = init, len = self.length;
  for(var i = self.start; i < len; i++) {
    if (memo instanceof Reduced)
      break;
    memo = f(memo, self[i]);
  }
  return deref(memo);
}

export function seq(self){
  return self.length ? self : null;
}

export const lookup = nth;

export function hasKey(self, key){
  return key > -1 && key < self.length;
}

export function assoc(self, key, value){
  var arr = slice(self);
  arr.splice(key, 1, value);
  return arr;
}

extend(Lookup, String, {
  lookup: lookup
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

extend(Trim, String, {
  trim: trim
});