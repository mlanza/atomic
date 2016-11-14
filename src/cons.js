import {identity, always, noop} from './core';
import Reduced from './reduced';
import {extend} from './protocol';
import Seq from './protocols/seq';
import Coll from './protocols/coll';
import Clone from './protocols/clone';

export function Cons(head, tail){
  this.head = head;
  this.tail = tail;
}

export function cons(head, tail){
  return new Cons(head, tail);
}

export const empty = always(null);
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
  return Coll.isEmpty(tail) ? tail : new Cons(self.head, function(){
    return Coll.initial(tail);
  });
}

export function reduce(self, f, init){ //TODO add reduced fn to test whether reduction is complete? will this affect transducers?
  return init instanceof Reduced ? init.valueOf() : Coll.reduce(self.tail(), f, f(init, self.head));
}

export function map(self, f){
  return new Cons(f(self.head), function(){
    return Coll.map(self.tail(), f);
  });
}

export function find(self, pred){
  return pred(self.head) ? self.head : find(self.tail(), pred);
}

export function filter(self, pred){
  return pred(self.head) ? new Cons(self.head, function(){
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
  return new Cons(value, always(self));
}

extend(Coll, {
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
  append: append
}, Cons);

extend(Seq, {
  seq: identity
}, Cons);

extend(Clone, {
  clone: identity
}, Cons);

export default Cons;