import {identity, always, noop, slice, complement} from '../core';
import {extend} from '../protocol';
import Reduced from '../types/reduced';
import {EMPTY} from '../types/empty';
import List from '../types/list';
import Seq from '../protocols/seq';
import Coll from '../protocols/coll';

export function Concat(){
  this.parts = arguments.length ? Coll.filter(slice(arguments), complement(Coll.isEmpty)) : [];
}

export function concat(){
  var that = new Concat();
  that.parts = arguments.length ? Coll.filter(slice(arguments), complement(Coll.isEmpty)) : [];
  return that;
}

export function isEmpty(self){
  return self.parts.length === 0;
}

export function toArray(self){
  return Coll.toArray(seq(self));
}

export function first(self){
  return Coll.first(Coll.first(self.parts));
}

export function rest(self){
  if (isEmpty(self)) return EMPTY;
  var fst = Coll.first(self.parts),
      rst = Coll.rest(fst);
  return Coll.isEmpty(rst) ? concat.apply(this, Coll.rest(self.parts)) : concat.apply(this, [rst].concat(Coll.rest(self.parts)));
}

export function initial(self){
  return Coll.initial(seq(self));
}

export function append(self, value){
  return new Concat(self, [value]);
}

export function each(self, f){
  Coll.each(seq(self), f);
}

export function reduce(self, f, init){
  return Coll.reduce(seq(self), f, init);
}

export function map(self, f){
  return Coll.map(seq(self), f);
}

export function filter(self, pred){
  return Coll.filter(seq(self), pred);
}

export function find(self, pred){
  return Coll.find(seq(self), pred);
}

export function seq(self){
  return isEmpty(self) ? EMPTY : new List(first(self), function(){
    return rest(self);
  });
}

extend(Seq, {
  seq: seq
}, Concat);

extend(Coll, {
  empty: always(EMPTY),
  isEmpty: isEmpty,
  toArray: toArray,
  toObject: null,
  first: first,
  rest: rest,
  initial: null,
  append: append,
  concat: concat,
  each: each,
  reduce: reduce,
  map: map,
  filter: filter,
  find: find
}, Concat);