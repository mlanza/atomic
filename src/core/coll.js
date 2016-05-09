import {Reduced, reduced} from './reduced.js';
import {complement} from './function.js';
import {empty} from './empty.js';
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

export function map(f, coll){
  return isEmpty(coll) ? empty : cons(f(first(coll)), function(){
    return map(f, rest(coll));
  });
}

export function filter(pred, coll){
  if (isEmpty(coll)) return empty;
  var item;
  do {
    item = first(coll), coll = rest(coll);
  } while (!pred(item));
  return item != null ? cons(item, function(){
    return filter(pred, coll);
  }) : empty;
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
  var item = first(coll), coll = rest(coll);
  return pred(item) ? cons(item, function(){
    return takeWhile(pred, coll);
  }) : empty;
}

export function takeNth(n, coll){
  if (isEmpty(coll)) return empty;
  var s = seq(coll);
  return cons(first(s), function(){
    return takeNth(n, drop(n, s));
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
  do {
    var item = first(coll);
    if (!pred(item)) break;
    coll = rest(coll);
  } while (true);
  return seq(coll);
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
