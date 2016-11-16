import {identity, always, noop} from '../core';
import Reduced from '../types/reduced';
import {EMPTY} from '../types/empty';
import {concat as _concat, seq as _seq} from '../types/concat';
import {extend} from '../protocol';
import Seq from '../protocols/seq';
import Coll from '../protocols/coll';

export function List(head, tail){
  this.head = head;
  this.tail = tail;
}

export function list(head, tail){
  return new List(head, tail);
}

export const empty = always(EMPTY);
export const isEmpty = always(false);

export function each(self, f){
  f(self.head);
  Coll.each(self.tail(), f);
}

export function first(self){
  return self.head;
}

export function rest(self){
  return self.tail();
}

export function initial(self){
  var tail = self.tail();
  return Coll.isEmpty(tail) ? tail : new List(self.head, function(){
    return Coll.initial(tail);
  });
}

export function reduce(self, f, init){ //TODO add reduced fn to test whether reduction is complete? will this affect transducers?
  return init instanceof Reduced ? init.valueOf() : Coll.reduce(self.tail(), f, f(init, self.head));
}

export function map(self, f){
  return new List(f(self.head), function(){
    return Coll.map(self.tail(), f);
  });
}

export function find(self, pred){
  return pred(self.head) ? self.head : Coll.find(self.tail(), pred);
}

export function filter(self, pred){
  return pred(self.head) ? new List(self.head, function(){
    return Coll.filter(self.tail(), pred);
  }) : Coll.filter(self.tail(), pred);
}

export function toArray(self){
  return reduce(self, Coll.append, []);
}

export function toObject(self){
  return Coll.reduce(self, function(memo, pair){
    memo[pair[0]] = pair[1];
    return memo;
  }, {});
}

export function append(self, value){
  return new List(value, always(self));
}

export function flatten(self){
  if (Coll.isEmpty(self)) return EMPTY;
  var nested = dispatch(Coll, 'isEmpty', self.head);
  return nested ? Coll.isEmpty(self.head) ? flatten(new List(Coll.first(self.tail()), function(){
    return Coll.rest(self.tail());
  })) : flatten(new List(Coll.first(self.head), function(){
    return flatten(new List(Coll.rest(self.head), self.tail));
  })) : new List(self.head, function(){
    return Coll.flatten(self.tail());
  });
}

export function concat(){
  return _seq(_concat.apply(this, arguments));
}

extend(Coll, List, {
  empty: empty,
  isEmpty: isEmpty,
  toArray: toArray,
  toObject: toObject,
  first: first,
  rest: rest,
  initial: initial,
  each: each,
  reduce: reduce,
  map: map,
  filter: filter,
  find: find,
  append: append,
  concat: concat
});

extend(Seq, List, {
  seq: identity
});

export default List;