import {curry, complement, identity, slice, isSome} from './core';
import {seq} from './protocols/seqable';
import Seq from './protocols/seq';
import Reduce from './protocols/reduce';
import Collection from './protocols/collection';
import {deref} from './protocols/deref';
import {EMPTY} from './types/empty';
import {reduced} from './types/reduced';
import {indexedSeq} from './types/indexed-seq';
import List from './types/list';

export function each(xs, f){
  var coll = seq(xs);
  if (!coll) return;
  f(Seq.first(coll));
  each(Seq.rest(coll), f);
}

export function map(xs, f){
  var coll = seq(xs);
  if (!coll) return EMPTY;
  return new List(f(Seq.first(coll)), function(){
    return map(Seq.rest(coll), f);
  });
}

export function mapIndexed(xs, f){
  var idx = -1;
  return map(xs, function(x){
    return f(++idx, x);
  });
}

export function keep(xs, f){
  return filter(map(xs, f), isSome);
}

export function take(xs, n){
  return n > 0 && seq(xs) ? new List(Seq.first(xs), function(){
    return take(Seq.rest(xs), n - 1);
  }) : EMPTY;
}

export function takeWhile(xs, pred){
  if (!seq(xs)) return EMPTY;
  var item = Seq.first(xs);
  return pred(item) ? new List(item, function(){
    return takeWhile(Seq.rest(xs), pred);
  }) : EMPTY;
}

export function takeNth(xs, n){
  return seq(xs) ? new List(Seq.first(xs), function(){
    return takeNth(drop(xs, n), n);
  }) : EMPTY;
}

export function drop(xs, n){
  var remaining = n;
  return dropWhile(xs, function(){
    return remaining-- > 0;
  });
}

export function dropWhile(xs, pred){
  return seq(xs) ? pred(Seq.first(xs)) ? dropWhile(Seq.rest(xs), pred) : seq(xs) : EMPTY;
}

export function some(xs, pred){
  return Reduce.reduce(xs, function(memo, value){
    return pred(value) ? reduced(value) : memo;
  }, null);
}

export function isEvery(xs, pred){
  return Reduce.reduce(xs, function(memo, value){
    return !pred(value) ? reduced(false) : memo;
  }, true);
}

export function isAny(xs, pred){
  return some(xs, pred) !== null;
}

export function isNotAny(xs, pred){
  return isAny(xs, complement(pred));
}

export function fold(xs, f, init){
  return init instanceof Reduced || seq(xs) ? fold(Seq.rest(xs), f, f(init, Seq.first(xs))) : deref(init);
}

export function all(xs, pred){
  return seq(xs) && pred(Seq.first(xs)) && all(Seq.rest(xs), pred);
}

export function filter(xs, pred){
  var coll = seq(xs);
  if (!coll) return EMPTY;
  var fst = Seq.first(coll);
  return pred(fst) ? new List(fst, function(){
    return filter(Seq.rest(coll), pred);
  }) : filter(Seq.rest(coll), pred);
}

export function reject(xs, pred){
  return filter(xs, complement(pred));
}

export function compact(xs){
  return filter(xs, identity);
}

export function find(xs, pred){
  var coll = seq(xs);
  if (!coll) return null;
  var fst = Seq.first(coll);
  return pred(fst) ? fst : find(Seq.rest(coll), pred);
}

//TODO flatten
export function concat(xs){
  var coll = toArray(compact(map(arguments, seq))),
      fst  = Seq.first(coll),
      rst  = Seq.rest(coll);
  if (!seq(coll)) return EMPTY;
  return new List(Seq.first(fst), function(){
    return seq(fst) ? concat.apply(this, [Seq.rest(fst)].concat(Seq.rest(coll))) : concat.apply(this, Seq.rest(coll));
  });
}

export function toArray(xs){
  if (xs instanceof Array) return xs;
  var coll = seq(xs);
  if (!coll) return [];
  return Reduce.reduce(coll, Collection.conj, []);
}

export function toObject(obj){
  if (obj == null) return {};
  if (obj.constructor === Object) return obj;
  var coll = seq(obj);
  if (!coll) return {};
  return Reduce.reduce(coll, Collection.conj, {});
}