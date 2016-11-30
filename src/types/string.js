import unbind from '../unbind';
import {flip, identity, add, slice} from '../core';
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
import Append from '../protocols/append';
import Prepend from '../protocols/prepend';
import Comparable from '../protocols/comparable';
import Reduced from '../types/reduced';
export const trim        = unbind(String.prototype.trim);
export const toLowerCase = unbind(String.prototype.toLowerCase);
export const toUpperCase = unbind(String.prototype.toUpperCase);
export const replace     = unbind(String.prototype.replace);
export const substring   = unbind(String.prototype.substring);
export const startsWith  = unbind(String.prototype.startsWith);
export const endsWith    = unbind(String.prototype.endsWith);

export function split(str, pattern, n){
  var parts = [];
  while(str && n !== 0){
    var found = str.match(pattern);
    if (!found || n < 2) {
      parts.push(str);
      break;
    }
    var pos  = str.indexOf(found),
        part = str.substring(0, pos);
    parts.push(part);
    str = str.substring(pos + found.length);
    n = n ? n - 1 : n;
  }
  return parts;
}

export function isBlank(str){
  return str == null || str.trim().length === 0;
}

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
  for(var i = 0; i < len; i++) {
    if (memo instanceof Reduced)
      break;
    memo = f(memo, self[i]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
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

export function compare(x, y){
  if (x > y) return +1;
  if (x < y) return -1;
  return 0;
}

export default extend(String, Comparable, {
  compare: compare
}, Lookup, {
  get: nth
}, Append, {
  append: add
}, Prepend, {
  prepend: flip(add)
}, Collection, {
  conj: add
}, Associative, {
  assoc: assoc,
  hasKey: hasKey
}, Emptyable, {
  empty: empty
}, Seqable, {
  seq: seq
}, Next, {
  next: next
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