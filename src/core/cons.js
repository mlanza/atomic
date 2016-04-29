import {overload, multiarity, partial, constantly, complement, compose} from './function.js';
import {identity} from './object.js';
import {Reduced, reduced} from './reduced.js';
import Extend from '../protocols/extend.js';
import Seq from '../protocols/seq.js';

export default function Cons(head, tail){
  this.head = head;
  this.tail = tail;
}

export function cons(head, tail){
  return new Cons(head, tail || constantly(EMPTY));
}

export const EMPTY = cons(null);
export const empty = constantly(EMPTY);

export function isEmpty(self){
  return self === EMPTY;
}

export function each(self, f){
  var result = null, next = self;
  while(next !== EMPTY && !(result instanceof Reduced)){
    result = f(next.head);
    next = next.tail();
  }
}

export function reduce(self, f, init) {
  var memo = init, next = self;
  while(next !== EMPTY && !(memo instanceof Reduced)){
    memo = f(memo, next.head);
    next = next.tail();
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function seq(coll){
  return isEmpty(coll) ? EMPTY : cons(Seq.first(coll), function(){
    return seq(Seq.rest(coll));
  });
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
  return self === EMPTY ? null : self.head;
}

export function rest(self){
  return self === EMPTY ? EMPTY : self.tail();
}

export function map(f, coll){
  return isEmpty(coll) ? EMPTY : cons(f(Seq.first(coll)), function(){
    return map(f, Seq.rest(coll));
  });
}

export function filter(pred, coll){
  if (isEmpty(coll)) return EMPTY;
  var item;
  do {
    item = Seq.first(coll), coll = Seq.rest(coll);
  } while (!pred(item));
  return item != null ? cons(item, function(){
    return filter(pred, coll);
  }) : EMPTY;
}

export function remove(pred, coll){
  return filter(complement(pred), coll);
}

export function take(n, coll){
  return n && !isEmpty(coll) ? cons(Seq.first(coll), function(){
    return take(n - 1, Seq.rest(coll));
  }) : EMPTY;
}

export function takeWhile(pred, coll){
  if (isEmpty(coll)) return EMPTY;
  var item = Seq.first(coll), coll = Seq.rest(coll);
  return pred(item) ? cons(item, function(){
    return takeWhile(pred, coll);
  }) : EMPTY;
}

export function dropWhile(pred, coll){
  if (isEmpty(coll)) return EMPTY;
  do {
    var item = Seq.first(coll);
    if (!pred(item)) break;
    coll = Seq.rest(coll);
  } while (true);
  return seq(coll);
}

export function some(pred, coll){
  return Seq.reduce(coll, function(memo, value){
    return pred(value) ? reduced(value) : memo;
  }, null);
}

export function isEvery(pred, coll){
  return Seq.reduce(coll, function(memo, value){
    return !pred(value) ? reduced(false) : memo;
  }, true);
}

export function isAny(pred, coll){
  return some(pred, coll) !== null;
}

export const isNotAny = complement(isAny);
