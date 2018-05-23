import {overload, constantly, identity} from "./core";
import {compare, count, nth, first, rest, next, seq, reduce, includes, conj, step, converse, unit, toArray, isSequential} from "./protocols";
import {inc, comp, not, partial, concat, concatenated, apply, isNil, cons, EMPTY, EMPTY_ARRAY, lazySeq, complement, slice, juxt, isSome, randInt, set} from "./types";
import * as pred from "./predicates";

export function map2(f, xs){
  return seq(xs) ? lazySeq(f(first(xs)), function(){
    return map2(f, rest(xs));
  }) : EMPTY;
}

export function mapcat(f, colls){
  return concatenated(map(f, colls));
}

export function filter(pred, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const head = first(coll);
  return pred(head) ? lazySeq(head, function(){
    return filter(pred, rest(coll));
  }) : filter(pred, rest(coll));
}

function distinct2(coll, seen){
  if (seq(coll)) {
    let fst = first(coll);
    if (includes(seen, fst)) {
      return distinct2(rest(coll), seen);
    } else {
      return lazySeq(fst, function(){
        return distinct2(rest(coll), conj(seen, fst));
      });
    }
  } else {
    return EMPTY;
  }
}

export function distinct(coll){
  return distinct2(coll, set());
}

export const compact = partial(filter, identity);

function transduce3(xform, f, coll){
  return transduce4(xform, f, f(), coll);
}

function transduce4(xform, f, init, coll){
  return reduce(coll, xform(f), init);
}

export const transduce = overload(null, null, null, transduce3, transduce4);

function into2(to, from){
  return reduce(from, conj, to);
}

function into3(to, xform, from){
  return transduce(xform, conj, to, from);
}

export const into = overload(constantly(EMPTY_ARRAY), identity, into2, into3);

export function each(f, xs){
  var ys = seq(xs);
  while(ys){
    f(first(ys));
    ys = seq(rest(ys));
  }
}

function dorun1(coll){
  let xs = seq(coll);
  while(xs){
    xs = next(xs);
  }
}

function dorun2(n, coll){
  let xs = seq(coll);
  while(xs && n > 0){
    n++;
    xs = next(xs);
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

export function dotimes(n, f){
  each(f, range(n))
}

export function proceed1(self){
  return step(unit(self), self);
}

export function proceed2(self, amount){
  return step(unit(self, amount), self);
}

export const proceed = overload(null, proceed1, proceed2);

export function recede1(self){
  return step(converse(unit(self)), self);
}

export function recede2(self, amount){
  return step(converse(unit(self, amount)), self);
}

export const recede = overload(null, recede1, recede2);

export function isEmpty(coll){
  return !seq(coll);
}

export function notEmpty(coll){
  return isEmpty(coll) ? null : coll;
}

export function some(pred, coll){
  var xs = seq(coll);
  while(xs && !pred(first(xs))){
    xs = next(xs);
  }
  return !!xs;
}

export const notSome = comp(not, some);
export const notAny  = notSome;

export function every(pred, coll){
  var xs = seq(coll);
  while(xs){
    if (!pred(first(xs))){
      return false;
    }
    xs = next(xs);
  }
  return true;
}

export const notEvery = comp(not, every);

function map3(f, c1, c2){
  var s1 = seq(c1),
      s2 = seq(c2);
  return s1 && s2 ? cons(f(first(s1), first(s2)), map3(f, rest(s1), rest(s2))) : EMPTY;
}

function map4(f, c1, c2, c3){
  var s1 = seq(c1),
      s2 = seq(c2),
      s3 = seq(c3);
  return s1 && s2 && s3 ? cons(f(first(s1), first(s2), first(s3)), map4(f, rest(s1), rest(s2), rest(s3))) : EMPTY;
}

function mapN(f, ...tail){
  var seqs = mapa(seq, tail);
  return notAny(isNil, seqs) ? cons(apply(f, mapa(first, seqs)), apply(mapN, f, mapa(rest, seqs))) : EMPTY;
}

export const map  = overload(null, null, map2, map3, mapN);
export const mapa = comp(toArray, map);

export function indexed(iter){
  return function(f, xs){
    var idx = -1;
    return iter(function(x){
      return f(++idx, x);
    }, xs);
  }
}

export const filtera = comp(toArray, filter);

export function remove(pred, xs){
  return filter(complement(pred), xs);
}

export function keep(f, xs){
  return filter(isSome, map2(f, xs));
}

export const mapIndexed  = indexed(map);
export const keepIndexed = indexed(keep);

export function drop(n, coll){
  var i = n,
      xs = seq(coll)
  while (i > 0 && xs) {
    xs = rest(xs);
    i = i - 1;
  }
  return xs;
}

export function dropWhile(pred, xs){
  return seq(xs) ? pred(first(xs)) ? dropWhile(pred, rest(xs)) : xs : EMPTY;
}

export function dropLast(n, coll){
  return map(function(x, _){
    return x;
  }, coll, drop(n, coll));
}

export function take(n, coll){
  const xs = seq(coll);
  return n > 0 && xs ? lazySeq(first(xs), function(){
    return take(n - 1, rest(xs));
  }) : EMPTY;
}

export function takeWhile(pred, xs){
  if (!seq(xs)) return EMPTY;
  const item = first(xs);
  return pred(item) ? lazySeq(item, function(){
    return takeWhile(pred, rest(xs));
  }) : EMPTY;
}

export function takeNth(n, xs){
  return seq(xs) ? lazySeq(first(xs), function(){
    return takeNth(n, drop2(n, xs));
  }) : EMPTY;
}

export function takeLast(n, coll){
  return n ? drop(count(coll) - n, coll) : EMPTY;
}

function interleave2(xs, ys){
  const as = seq(xs),
        bs = seq(ys);
  return as != null && bs != null ? cons(first(as), lazySeq(first(bs), function(){
    return interleave2(rest(as), rest(bs));
  })) : EMPTY;
}

function interleaveN(...colls){
  return concatenated(interleaved(colls));
}

export function interleaved(colls){
  return filter(isNil, colls) === EMPTY ? lazySeq(map2(first, colls), function(){
    return interleaved(map2(next, colls));
  }) : EMPTY;
}

export const interleave = overload(null, null, interleave2, interleaveN);

export function interpose(sep, xs){
  return drop(1, interleave2(repeat1(sep), xs));
}

function partition1(n){
  return partial(partition, n);
}

function partition2(n, xs){
  return partition3(n, n, xs);
}

function partition3(n, step, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const part = take(n, coll);
  return n === count(part) ? cons(part, partition3(n, step, drop(step, coll))) : EMPTY;
}

function partition4(n, step, pad, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const part = take(n, coll);
  return n === count(part) ? cons(part, partition4(n, step, pad, drop(step, coll))) : cons(take(n, concat(part, pad)));
}

export const partition = overload(null, partition1, partition2, partition3, partition4);

export function partitionAll1(n){
  return partial(partitionAll, n);
}

export function partitionAll2(n, xs){
  return partitionAll3(n, n, xs);
}

export function partitionAll3(n, step, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  return cons(take(n, coll), partition3(n, step, drop(step, coll)));
}

export const partitionAll = overload(null, partitionAll1, partitionAll2, partitionAll3);

export function partitionBy(f, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const head = first(coll),
        val  = f(head),
        run  = cons(head, takeWhile2(function(x){
          return val === f(x);
        }, next(coll)));
  return cons(run, partitionBy(f, seq(drop(count(run), coll))));
}

export const butlast = partial(dropLast, 1);
export const initial = butlast;

export function last(coll){
  let xs = coll, ys = null;
  while (ys = next(xs)) {
    xs = ys;
  }
  return first(xs);
}

export function dedupe(coll){
  var xs = seq(coll);
  const last = first(xs);
  return xs ? lazySeq(last, function(){
    while(next(xs) && first(next(xs)) === last) {
      xs = next(xs);
    }
    return dedupe(next(xs));
  }) : EMPTY;
}

function isDistinct1(coll){
  let seen = new Set();
  return reduce(coll, function(memo, x){
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

export const isDistinct = overload(null, constantly(true), pred.notEq, isDistinctN);
export const splitAt    = juxt(take, drop);
export const splitWith  = juxt(takeWhile, dropWhile);

function sort1(coll){
  return sort2(compare, coll);
}

function sort2(compare, coll){
  return into([], coll).sort(compare);
}

export const sort = overload(null, sort1, sort2);

function sortBy2(keyFn, coll){
  return sortBy3(keyFn, compare, coll);
}

function sortBy3(keyFn, compare, coll){
  return sort(function(x, y){
    return compare(keyFn(x), keyFn(y));
  }, coll);
}

export const sortBy = overload(null, null, sortBy2, sortBy3);

function groupInto(seed, f, coll){
  return reduce(coll, function(memo, value){
    return update(memo, f(value), function(group){
      return conj(group || [], value);
    });
  }, seed);
}

export function groupBy(f, coll){
  return groupInto({}, f, coll);
}

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
    if (seq(colls)) {
      apply(doseq, function(...args){
        apply(f, x, args);
      }, colls);
    } else {
      f(x);
    }
  }, xs || []);
}

export const doseq = overload(null, null, each, doseq3, doseq4, doseqN);

export function coalesce(xs){
  return detect(identity, xs);
}

export const detect = comp(first, filter);

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

export function cycle(coll){
  return seq(coll) ? lazySeq(first(coll), function(){
    return concat(rest(coll), cycle(coll));
  }) : EMPTY;
}

export function treeSeq(branch, children, root){
  function walk(node){
    return cons(node, branch(node) ? mapcat(walk, children(node)) : EMPTY);
  }
  return walk(root);
}

export function flatten(coll){
  return filter(complement(isSequential), rest(treeSeq(isSequential, seq, coll)));
}

export function randNth(coll){
  return nth(coll, randInt(count(coll)));
}

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

export function zip(...colls){
  return mapcat(identity, map(seq, ...colls));
}

//e.g. counter: generate(iterate(inc, 0)) or partial(generate, iterate(inc, 0))) for a counter factory;
export function generate(iterable){
  let iter = iterable[Symbol.iterator]();
  return function(){
    return iter.done ? null : iter.next().value;
  }
}

export function best(pred, xs){
  const coll = seq(xs);
  return coll ? reduce(rest(coll), function(a, b){
    return pred(a, b) ? a : b;
  }, first(coll)) : null;
}

export function scan(pred, xs){
  if (!seq(xs)) return true;
  let head = first(xs),
      coll = next(xs);
  while (coll){
    if (pred(head, first(coll))){
      head = first(coll);
      coll = next(coll);
    } else {
      return false;
    }
  }
  return true;
}