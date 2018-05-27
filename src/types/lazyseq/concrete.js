import {isSequential, IInclusive, IIndexed, ICollection, IComparable, ICounted, ISeq, ISeqable, INext, IHierarchy, IHierarchicalSet, IReduce, IArr} from '../../protocols';
import {identity, constantly, overload} from '../../core';
import {EMPTY} from '../empty/construct';
import {EMPTY_ARRAY} from '../array/construct';
import {set} from '../set/construct';
import {inc, randInt} from '../number/concrete';
import {reduced} from '../reduced/construct';
import {not} from '../boolean';
import {isNil, isSome} from '../nil';
import {cons} from '../list/construct';
import {juxt, complement, comp, apply, partial} from '../function/concrete';
import {lazySeq} from '../lazyseq/construct';
import {elements} from '../elements/construct';
import {concat, concatenated} from "../concatenated/construct";

function transduce3(xform, f, coll){
  return transduce4(xform, f, f(), coll);
}

function transduce4(xform, f, init, coll){
  return IReduce.reduce(coll, xform(f), init);
}

export const transduce = overload(null, null, null, transduce3, transduce4);

function into2(to, from){
  return IReduce.reduce(from, ICollection.conj, to);
}

function into3(to, xform, from){
  return transduce(xform, ICollection.conj, to, from);
}

export const into = overload(constantly(EMPTY_ARRAY), identity, into2, into3);

export function each(f, xs){
  var ys = ISeqable.seq(xs);
  while(ys){
    f(ISeq.first(ys));
    ys = ISeqable.seq(ISeq.rest(ys));
  }
}

export function juxts(f, ...fs){
  return arguments.length ? function(x){
    return lazySeq(f(x), function(){
      return apply(juxts, fs)(x);
    });
  } : constantly(EMPTY);
}

export function some(pred, coll){
  var xs = ISeqable.seq(coll);
  while(xs && !pred(ISeq.first(xs))){
    xs = INext.next(xs);
  }
  return !!xs;
}

export const notSome = comp(not, some);
export const notAny  = notSome;

export function every(pred, coll){
  var xs = ISeqable.seq(coll);
  while(xs){
    if (!pred(ISeq.first(xs))){
      return false;
    }
    xs = INext.next(xs);
  }
  return true;
}

export const notEvery = comp(not, every);

function map2(f, xs){
  return ISeqable.seq(xs) ? lazySeq(f(ISeq.first(xs)), function(){
    return map2(f, ISeq.rest(xs));
  }) : EMPTY;
}

function map3(f, c1, c2){
  var s1 = ISeqable.seq(c1),
      s2 = ISeqable.seq(c2);
  return s1 && s2 ? cons(f(ISeq.first(s1), ISeq.first(s2)), map3(f, ISeq.rest(s1), ISeq.rest(s2))) : EMPTY;
}

function map4(f, c1, c2, c3){
  var s1 = ISeqable.seq(c1),
      s2 = ISeqable.seq(c2),
      s3 = ISeqable.seq(c3);
  return s1 && s2 && s3 ? cons(f(ISeq.first(s1), ISeq.first(s2), ISeq.first(s3)), map4(f, ISeq.rest(s1), ISeq.rest(s2), ISeq.rest(s3))) : EMPTY;
}

function mapN(f, ...tail){
  var seqs = mapa(ISeqable.seq, tail);
  return notAny(isNil, seqs) ? cons(apply(f, mapa(ISeq.first, seqs)), apply(mapN, f, mapa(ISeq.rest, seqs))) : EMPTY;
}

export const map  = overload(null, null, map2, map3, mapN);

export function mapcat(f, colls){
  return concatenated(map(f, colls));
}

export function filter(pred, xs){
  const coll = ISeqable.seq(xs);
  if (!coll) return EMPTY;
  const head = ISeq.first(coll);
  return pred(head) ? lazySeq(head, function(){
    return filter(pred, ISeq.rest(coll));
  }) : filter(pred, ISeq.rest(coll));
}

function distinct2(coll, seen){
  if (ISeqable.seq(coll)) {
    let fst = ISeq.first(coll);
    if (IInclusive.includes(seen, fst)) {
      return distinct2(ISeq.rest(coll), seen);
    } else {
      return lazySeq(fst, function(){
        return distinct2(ISeq.rest(coll), ICollection.conj(seen, fst));
      });
    }
  } else {
    return EMPTY;
  }
}

export function distinct(coll){
  return distinct2(coll, set());
}

export function compact(coll){
  return filter(identity, coll);
}

export function cycle(coll){
  return ISeqable.seq(coll) ? lazySeq(ISeq.first(coll), function(){
    return concat(ISeq.rest(coll), cycle(coll));
  }) : EMPTY;
}

export function treeSeq(branch, children, root){
  function walk(node){
    return cons(node, branch(node) ? mapcat(walk, children(node)) : EMPTY);
  }
  return walk(root);
}

export function flatten(coll){
  return filter(complement(isSequential), ISeq.rest(treeSeq(isSequential, ISeqable.seq, coll)));
}

export function zip(...colls){
  return mapcat(identity, map(ISeqable.seq, ...colls));
}

export const filtera = comp(IArr.toArray, filter);

export function remove(pred, xs){
  return filter(complement(pred), xs);
}

export function keep(f, xs){
  return filter(isSome, map(f, xs));
}

export function drop(n, coll){
  var i = n,
      xs = ISeqable.seq(coll)
  while (i > 0 && xs) {
    xs = ISeq.rest(xs);
    i = i - 1;
  }
  return xs;
}

export function dropWhile(pred, xs){
  return ISeqable.seq(xs) ? pred(ISeq.first(xs)) ? dropWhile(pred, ISeq.rest(xs)) : xs : EMPTY;
}

export function dropLast(n, coll){
  return map(function(x, _){
    return x;
  }, coll, drop(n, coll));
}

export function take(n, coll){
  const xs = ISeqable.seq(coll);
  return n > 0 && xs ? lazySeq(ISeq.first(xs), function(){
    return take(n - 1, ISeq.rest(xs));
  }) : EMPTY;
}

export function takeWhile(pred, xs){
  if (!ISeqable.seq(xs)) return EMPTY;
  const item = ISeq.first(xs);
  return pred(item) ? lazySeq(item, function(){
    return takeWhile(pred, ISeq.rest(xs));
  }) : EMPTY;
}

export function takeNth(n, xs){
  return ISeqable.seq(xs) ? lazySeq(ISeq.first(xs), function(){
    return takeNth(n, drop2(n, xs));
  }) : EMPTY;
}

export function takeLast(n, coll){
  return n ? drop(ICounted.count(coll) - n, coll) : EMPTY;
}

function interleave2(xs, ys){
  const as = ISeqable.seq(xs),
        bs = ISeqable.seq(ys);
  return as != null && bs != null ? cons(ISeq.first(as), lazySeq(ISeq.first(bs), function(){
    return interleave2(ISeq.rest(as), ISeq.rest(bs));
  })) : EMPTY;
}

function interleaveN(...colls){
  return concatenated(interleaved(colls));
}

export function interleaved(colls){
  return filter(isNil, colls) === EMPTY ? lazySeq(map(ISeq.first, colls), function(){
    return interleaved(map(INext.next, colls));
  }) : EMPTY;
}

export const interleave = overload(null, null, interleave2, interleaveN);

export function interpose(sep, xs){
  return drop(1, interleave2(repeat1(sep), xs));
}

function partition2(n, xs){
  return partition3(n, n, xs);
}

function partition3(n, step, xs){
  const coll = ISeqable.seq(xs);
  if (!coll) return EMPTY;
  const part = take(n, coll);
  return n === ICounted.count(part) ? cons(part, partition3(n, step, drop(step, coll))) : EMPTY;
}

function partition4(n, step, pad, xs){
  const coll = ISeqable.seq(xs);
  if (!coll) return EMPTY;
  const part = take(n, coll);
  return n === ICounted.count(part) ? cons(part, partition4(n, step, pad, drop(step, coll))) : cons(take(n, concat(part, pad)));
}

export const partition = overload(null, null, partition2, partition3, partition4);

export function partitionAll1(n){
  return partial(partitionAll, n);
}

export function partitionAll2(n, xs){
  return partitionAll3(n, n, xs);
}

export function partitionAll3(n, step, xs){
  const coll = ISeqable.seq(xs);
  if (!coll) return EMPTY;
  return cons(take(n, coll), partition3(n, step, drop(step, coll)));
}

export const partitionAll = overload(null, partitionAll1, partitionAll2, partitionAll3);

export function partitionBy(f, xs){
  const coll = ISeqable.seq(xs);
  if (!coll) return EMPTY;
  const head = ISeq.first(coll),
        val  = f(head),
        run  = cons(head, takeWhile2(function(x){
          return val === f(x);
        }, INext.next(coll)));
  return cons(run, partitionBy(f, ISeqable.seq(drop(ICounted.count(run), coll))));
}

export function last(coll){
  let xs = coll, ys = null;
  while (ys = INext.next(xs)) {
    xs = ys;
  }
  return ISeq.first(xs);
}

export function dedupe(coll){
  var xs = ISeqable.seq(coll);
  const last = ISeq.first(xs);
  return xs ? lazySeq(last, function(){
    while(INext.next(xs) && ISeq.first(INext.next(xs)) === last) {
      xs = INext.next(xs);
    }
    return dedupe(INext.next(xs));
  }) : EMPTY;
}

export function indexed(iter){
  return function(f, xs){
    var idx = -1;
    return iter(function(x){
      return f(++idx, x);
    }, xs);
  }
}

export function coalesce(xs){
  return detect(identity, xs);
}

function repeatedly1(f){
  return lazySeq(f(), function(){
    return repeatedly1(f);
  });
}

function repeatedly2(n, f){
  return take(n, repeatedly1(f));
}

export const repeatedly = overload(null, repeatedly1, repeatedly2);

function repeat1(x){
  return repeatedly1(constantly(x));
}

function repeat2(n, x){
  return repeatedly2(n, constantly(x));
}

export const repeat = overload(null, repeat1, repeat2);

export function isEmpty(coll){
  return !ISeqable.seq(coll);
}

export function notEmpty(coll){
  return isEmpty(coll) ? null : coll;
}

function sort1(coll){
  return sort2(IComparable.compare, coll);
}

function sort2(compare, coll){
  return into([], coll).sort(compare);
}

export const sort = overload(null, sort1, sort2);

function sortBy2(keyFn, coll){
  return sortBy3(keyFn, IComparable.compare, coll);
}

function sortBy3(keyFn, compare, coll){
  return sort(function(x, y){
    return IComparable.compare(keyFn(x), keyFn(y));
  }, coll);
}

export const sortBy = overload(null, null, sortBy2, sortBy3);

export const detect      = comp(ISeq.first, filter);
export const mapa        = comp(IArr.toArray, map);
export const butlast     = partial(dropLast, 1);
export const initial     = butlast;
export const mapIndexed  = indexed(map);
export const keepIndexed = indexed(keep);
export const splitAt     = juxt(take, drop);
export const splitWith   = juxt(takeWhile, dropWhile);

function eles(map){
  return function(f){
    return function(coll){
      return elements(distinct(compact(map(f, filter(function(el){
        return el !== document;
      }, coll instanceof Element ? ISeqable.seq([coll]) : ISeqable.seq(coll))))));
    }
  }
}

export const mapping     = eles(map);
export const mapcatting  = eles(mapcat);

function doseq3(f, xs, ys){
  each(function(x){
    each(function(y){
      f(x, y);
    }, ys);
  }, xs);
}

function doseq4(f, xs, ys, zs){
  each(function(x){
    each(function(y){
      each(function(z){
        f(x, y, z);
      }, zs);
    }, ys);
  }, xs);
}

export function doseqN(f, xs, ...colls){
  each(function(x){
    if (ISeqable.seq(colls)) {
      apply(doseq, function(...args){
        apply(f, x, args);
      }, colls);
    } else {
      f(x);
    }
  }, xs || []);
}

export const doseq = overload(null, null, each, doseq3, doseq4, doseqN);

export function best(pred, xs){
  const coll = ISeqable.seq(xs);
  return coll ? IReduce.reduce(ISeq.rest(coll), function(a, b){
    return pred(a, b) ? a : b;
  }, ISeq.first(coll)) : null;
}

export function scan(pred, xs){
  if (!ISeqable.seq(xs)) return true;
  let head = ISeq.first(xs),
      coll = INext.next(xs);
  while (coll){
    if (pred(head, ISeq.first(coll))){
      head = ISeq.first(coll);
      coll = INext.next(coll);
    } else {
      return false;
    }
  }
  return true;
}

function isDistinct1(coll){
  let seen = new Set();
  return IReduce.reduce(coll, function(memo, x){
    if (memo && seen.has(x)) {
      return reduced(false);
    }
    seen.add(x);
    return memo;
  }, true);
}

function isDistinctN(...xs){
  return isDistinct1(xs);
}

export const isDistinct = overload(null, constantly(true), function(a, b){
  return a !== b;
}, isDistinctN);

function dorun1(coll){
  let xs = ISeqable.seq(coll);
  while(xs){
    xs = INext.next(xs);
  }
}

function dorun2(n, coll){
  let xs = ISeqable.seq(coll);
  while(xs && n > 0){
    n++;
    xs = INext.next(xs);
  }
}

export const dorun = overload(null, dorun1, dorun2);

function doall1(coll){
  dorun(coll);
  return coll;
}

function doall2(n, coll){
  dorun(n, coll);
  return coll;
}

export const doall = overload(null, doall1, doall2);

export function iterate(f, x){
  return lazySeq(x, function(){
    return iterate(f, f(x));
  });
}

export function integers(){
  return iterate(inc, 1);
}

function range0(){
  return iterate(inc, 0);
}

function range1(end){
  return range3(0, end, 1);
}

function range2(start, end){
  return range3(start, end, 1);
}

function range3(start, end, step){
  return start < end ? lazySeq(start, function(){
    return range3(start + step, end, step);
  }) : EMPTY;
}

export const range = overload(range0, range1, range2, range3);

export function dotimes(n, f){
  each(f, range(n))
}

export function randNth(coll){
  return IIndexed.nth(coll, randInt(ICounted.count(coll)));
}

export function cond(...conditions){
  return function(...args){
    return IReduce.reduce(partition(2, conditions), function(memo, condition){
      const pred = ISeq.first(condition);
      return pred(...args) ? reduced(ISeq.first(ISeq.rest(condition))) : memo;
    }, null);
  }
}

function join1(xs){
  return into("", map2(str, xs));
}

function join2(sep, xs){
  return join1(interpose(sep, xs));
}

export const join = overload(null, join1, join2);

export function shuffle(coll) {
  let a = Array.from(coll);
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
