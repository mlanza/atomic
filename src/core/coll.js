import {reduced} from './reduced.js';
import {complement} from './function.js';
import {cons, isEmpty, EMPTY} from './cons.js';
import {first, rest} from '../protocols/seq.js';
import {reduce} from '../protocols/reduce.js';

export function seq(coll){
  return isEmpty(coll) ? EMPTY : cons(first(coll), function(){
    return seq(rest(coll));
  });
}

export function map(f, coll){
  return isEmpty(coll) ? EMPTY : cons(f(first(coll)), function(){
    return map(f, rest(coll));
  });
}

export function filter(pred, coll){
  if (isEmpty(coll)) return EMPTY;
  var item;
  do {
    item = first(coll), coll = rest(coll);
  } while (!pred(item));
  return item != null ? cons(item, function(){
    return filter(pred, coll);
  }) : EMPTY;
}

export function remove(pred, coll){
  return filter(complement(pred), coll);
}

export function take(n, coll){
  return n && !isEmpty(coll) ? cons(first(coll), function(){
    return take(n - 1, rest(coll));
  }) : EMPTY;
}

export function takeWhile(pred, coll){
  if (isEmpty(coll)) return EMPTY;
  var item = first(coll), coll = rest(coll);
  return pred(item) ? cons(item, function(){
    return takeWhile(pred, coll);
  }) : EMPTY;
}

export function takeNth(n, coll){
  if (isEmpty(coll)) return EMPTY;
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
  if (isEmpty(coll)) return EMPTY;
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
