import {curry, complement, identity, slice} from './core';
import {seq} from './protocols/seqable';
import Seq from './protocols/seq';
import Reduce from './protocols/reduce';
import Collection from './protocols/collection';
import {EMPTY} from './types/empty';
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