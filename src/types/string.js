import unbind from '../unbind.js';
import {flip, identity, add, first, rest, slice} from '../core.js';
import {extend} from '../protocol';
import Trim from '../protocols/trim';
import Coll from '../protocols/coll';
import Seq from '../protocols/seq';
import {isEmpty, map as toArray, find, seq, reduce} from '../types/array';

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

export function map(self, f){
  var memo = "", len = self.length;
  for(var i = 0; i < len; i++){
    memo += f(self[i]);
  }
  return memo;
}

export function filter(self, pred){
  var memo = "", len = self.length;
  for(var i = 0; i < len; i++){
    if (pred(self[i]))
      memo += self[i];
  }
  return memo;
}

extend(Coll, String, {
  empty: empty,
  isEmpty: isEmpty,
  toArray: toArray,
  first: first,
  rest: rest,
  map: map,
  reduce: reduce,
  filter: filter,
  find: find,
  append: append,
  concat: concat
});

extend(Seq, String, {
  seq: seq
});

extend(Trim, String, {
  trim: trim
});