import {Reduced, reduced} from './reduced.js';
import {Empty, empty as EMPTY} from './empty.js';
import {overload, multiarity, partial, constantly, complement, compose} from './function.js';
import {identity} from './core.js';

export default function Cons(head, tail){
  this.head = head;
  this.tail = tail;
}

export function cons(head, tail){
  return new Cons(head, tail || constantly(EMPTY));
}

export function isEmpty(self){
  return false;
}

export function empty(){
  return EMPTY;
}

export function each(self, f){
  var result = null, next = self;
  while (next !== EMPTY && !(result instanceof Reduced)){
    result = f(next.head);
    next = next.tail();
  }
}

export function reduce(self, f, init) {
  var memo = init, next = self;
  while (next !== EMPTY && !(memo instanceof Reduced)){
    memo = f(memo, next.head);
    next = next.tail();
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function iterate(generate, seed){
  return cons(seed, function(){
    return iterate(generate, generate(seed));
  });
}

export const repeatedly = multiarity(function(f){
  return iterate(f, f());
}, function(n, f){
  return n > 0 ? cons(f(), function(){
    return repeatedly(n - 1, f);
  }) : EMPTY;
});

export const repeat = overload(null, function(value){
  return repeatedly(constantly(value));
}, function(n, value){
  return repeatedly(n, constantly(value))
});

export function first(self){
  return self.head;
}

export function rest(self){
  return self.tail();
}
