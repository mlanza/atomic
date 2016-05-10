import {Reduced, reduced} from './reduced.js';
import {complement, overload, constantly} from './function.js';
import {empty} from './empty.js';
import {isSome} from './object.js';
import {slice} from './array.js';
import {cons} from './cons.js';
import {deref} from '../protocols/deref.js';
import {isEmpty} from '../protocols/emptiable.js';
import {first, rest} from '../protocols/seq.js';
import {reduce} from '../protocols/reduce.js';

export function seq(coll){
  return isEmpty(coll) ? empty : cons(first(coll), function(){
    return seq(rest(coll));
  });
}

export const concat = overload(constantly(empty), seq, function(coll){
  var tail = rest(arguments);
  return isEmpty(coll) ? concat.apply(this, tail) : cons(first(coll), function(){
    return concat.apply(this, [rest(coll)].concat(tail));
  });
});

export function map(f, coll){
  return isEmpty(coll) ? empty : cons(f(first(coll)), function(){
    return map(f, rest(coll));
  });
}

export function mapIndexed(f, coll){
  var idx = -1;
  return map(function(x){
    return f(++idx, x);
  }, coll);
}

export function filter(pred, coll){
  if (isEmpty(coll)) return empty;
  var item = first(coll);
  return pred(item) ? cons(item, function(){
    return filter(pred, rest(coll));
  }) : filter(pred, rest(coll));
}

export function keep(f, coll){
  return filter(isSome, map(f, coll));
}

export function remove(pred, coll){
  return filter(complement(pred), coll);
}

export function take(n, coll){
  return n && !isEmpty(coll) ? cons(first(coll), function(){
    return take(n - 1, rest(coll));
  }) : empty;
}

export function takeWhile(pred, coll){
  if (isEmpty(coll)) return empty;
  var item = first(coll);
  return pred(item) ? cons(item, function(){
    return takeWhile(pred, rest(coll));
  }) : empty;
}

export function takeNth(n, coll){
  return isEmpty(coll) ? empty : cons(first(coll), function(){
    return takeNth(n, drop(n, coll));
  });
}

export function drop(n, coll){
  var remaining = n;
  return dropWhile(function(){
    return remaining-- > 0;
  }, coll);
}

export function dropWhile(pred, coll){
  if (isEmpty(coll)) return empty;
  var item = first(coll);
  return pred(item) ? dropWhile(pred, rest(coll)) : seq(coll);
}

export function some(pred, coll){
  return reduce(coll, function(memo, value){
    return pred(value) ? reduced(value) : memo;
  }, null);
}

export function isEvery(pred, coll){
  return reduce(coll, function(memo, value){
    return !pred(value) ? reduced(false) : memo;
  }, true);
}

export function isAny(pred, coll){
  return some(pred, coll) !== null;
}

export const isNotAny = complement(isAny);

export function fold(self, f, init){
  return init instanceof Reduced || isEmpty(self) ? deref(init) : fold(rest(self), f, f(init, first(self)));
}

export function all(self, f){
  !isEmpty(self) && f(first(self)) && all(rest(self), f);
}
