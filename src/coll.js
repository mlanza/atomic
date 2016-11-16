import {curry} from './core';
import {seq} from './protocols/seqable';
import Seq from './protocols/seq';
import Reduce from './protocols/reduce';
import Collection from './protocols/collection';
import {EMPTY} from './types/empty';
import List from './types/list';

export const each = curry(function(f, xs){
  var coll = seq(xs);
  if (!coll) return;
  f(Seq.first(coll));
  each(f, Seq.rest(coll));
});

export const map = curry(function(f, xs){
  var coll = seq(xs);
  if (!coll) return EMPTY;
  return new List(f(Seq.first(coll)), function(){
    return map(f, Seq.rest(coll));
  });
});

export const filter = curry(function(pred, xs){
  var coll = seq(xs);
  if (!coll) return EMPTY;
  var fst = Seq.first(coll);
  return pred(fst) ? new List(fst, function(){
    return filter(pred, Seq.rest(coll));
  }) : filter(pred, Seq.rest(coll));
});

export const find = curry(function(pred, xs){
  var coll = seq(xs);
  if (!coll) return null;
  var fst = Seq.first(coll);
  return pred(fst) ? fst : find(pred, Seq.rest(coll));
});

export function toArray(xs){
  if (xs instanceof Array) return xs;
  var coll = seq(xs);
  if (!coll) return [];
  return Reduce.reduce(coll, function(memo, x){
    return memo.concat([x]);
  }, []);
}

export function toObject(obj){
  if (obj.constructor === Object) return obj;
  var coll = seq(obj);
  if (!coll) {};
  return Reduce.reduce(coll, Collection.conj, {});
}