import {identity, always, noop, multiarity, overload} from '../core';
import {inc} from '../curried';
import Reduced from '../types/reduced';
import {EMPTY} from '../types/empty';
import {extend} from '../protocol';
import {seq} from '../protocols/seqable';
import Seq from '../protocols/seq';
import Next from '../protocols/next';
import Emptyable from '../protocols/emptyable';
import Seqable from '../protocols/seqable';
import Reduce from '../protocols/reduce';
import Collection from '../protocols/reduce';
import {deref} from '../protocols/deref';

export function List(head, tail){
  this.head = head;
  this.tail = tail;
}

export function list(head, tail){
  return new List(head, tail);
}

export function iterate(generate, seed){
  return new List(seed, function(){
    return iterate(generate, generate(seed));
  });
}

export const repeatedly = multiarity(function(f){
  return iterate(f, f());
}, function(n, f){
  return n > 0 ? new List(f(), function(){
    return repeatedly(n - 1, f);
  }) : EMPTY;
});

export const repeat = overload(null, function(value){
  return repeatedly(always(value));
}, function(n, value){
  return repeatedly(n, always(value))
});

export const range = multiarity(function(){ //TODO number range, date range, string range, etc.
  return iterate(inc, 0);
}, function(end){
  return range(0, end, 1);
}, function(start, end){
  return range(start, end, 1);
}, function(start, end, step){
  var next = start + step;
  return next >= end ? cons(start) : cons(start, function(){
    return range(next, end, step);
  });
});

export const empty = always(EMPTY);

export function first(self){
  return self.head;
}

export function rest(self){
  return self.tail();
}

export function next(self){
  return seq(self.tail());
}

export function reduce(self, f, init){
  return init instanceof Reduced ? deref(init) : Reduce.reduce(self.tail(), f, f(init, self.head));
}

export function conj(self, value){
  return new List(value, always(self));
}

extend(Collection, List, {
  conj: conj
});

extend(Emptyable, List, {
  empty: empty
});

extend(Reduce, List, {
  reduce: reduce
});

extend(Seqable, List, {
  seq: identity
});

extend(Next, List, {
  next: next
});

extend(Seq, List, {
  first: first,
  rest: rest
});

export default List;