import {ICompactable, IEquiv, IMap, ICoerceable, IAssociative, ILookup, IInclusive, IIndexed, ICollection, IComparable, ICounted, ISeq, ISeqable, INext, IHierarchy, IReduce, ISequential} from '../../protocols';
import {trampoline, identity, constantly, overload} from '../../core';
import {EmptyList, emptyList} from '../empty-list/construct';
import {emptyArray} from '../array/construct';
import {inc, randInt} from '../number/concrete';
import {reduced} from '../reduced/construct';
import {not} from '../boolean';
import {isNil, isSome} from '../nil';
import {cons} from '../list/construct';
import {range} from '../range/construct';
import {str} from '../string/concrete';
import {juxt, complement, comp, apply, partial} from '../function/concrete';
import {get, getIn} from "../../protocols/ilookup/concrete";
import {lazySeq} from '../lazy-seq/construct';
import {concat, concatenated} from "../concatenated/construct";
import {satisfies} from '../protocol/concrete';
import {Symbol} from '../symbol/construct';
import {update, assocIn} from "../../protocols/iassociative/concrete";
import {first} from "../../protocols/iseq/concrete";
import {_ as v} from "param.macro";

function map2(f, xs){
  return ISeqable.seq(xs) ? lazySeq(function(){
    return cons(f(ISeq.first(xs)), map2(f, ISeq.rest(xs)));
  }) : emptyList();
}

function map3(f, c1, c2){
  const s1 = ISeqable.seq(c1),
        s2 = ISeqable.seq(c2);
  return s1 && s2 ? cons(f(ISeq.first(s1), ISeq.first(s2)), map3(f, ISeq.rest(s1), ISeq.rest(s2))) : emptyList();
}

function map4(f, c1, c2, c3){
  const s1 = ISeqable.seq(c1),
        s2 = ISeqable.seq(c2),
        s3 = ISeqable.seq(c3);
  return s1 && s2 && s3 ? cons(f(ISeq.first(s1), ISeq.first(s2), ISeq.first(s3)), map4(f, ISeq.rest(s1), ISeq.rest(s2), ISeq.rest(s3))) : emptyList();
}

function mapN(f, ...tail){
  const seqs = mapa(ISeqable.seq, tail);
  return notAny(isNil, seqs) ? cons(apply(f, mapa(ISeq.first, seqs)), apply(mapN, f, mapa(ISeq.rest, seqs))) : emptyList();
}

export const map  = overload(null, null, map2, map3, mapN);
export const mapa = comp(ICoerceable.toArray, map);

export function keyed(f, keys){
  return IReduce.reduce(keys, function(memo, key){
    return IAssociative.assoc(memo, key, f(key));
  }, {});
}

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

export const into = overload(emptyArray, identity, into2, into3);


//TODO unnecessary if CQS pattern is that commands return self
function doing1(f){
  return doing2(f, identity);
}

function doing2(f, order){
  return function(self, ...xs){
    each(f(self, v), order(xs));
  }
}

export const doing = overload(null, doing1, doing2); //mutating counterpart to `reducing`

export function each(f, xs){
  let ys = ISeqable.seq(xs);
  while(ys){
    f(ISeq.first(ys));
    ys = ISeqable.seq(ISeq.rest(ys));
  }
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

function doseqN(f, xs, ...colls){
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

export function eachkv(f, xs){
  each(function([key, value]){
    return f(key, value);
  }, entries(xs));
}

export function eachvk(f, xs){
  each(function([key, value]){
    return f(value, key);
  }, entries(xs));
}

function entries2(xs, keys){
  return ISeqable.seq(keys) ? lazySeq(function(){
    return cons([ISeq.first(keys), ILookup.lookup(xs, ISeq.first(keys))], entries2(xs, ISeq.rest(keys)));
  }) : emptyList();
}

function entries1(xs){
  return entries2(xs, IMap.keys(xs));
}

export const entries = overload(null, entries1, entries2);

export function mapkv(f, xs){
  return map(function([key, value]){
    return f(key, value);
  }, entries(xs));
}

export function mapvk(f, xs){
  return map(function([key, value]){
    return f(value, key);
  }, entries(xs));
}

export function seek(...fs){
  return function(...args){
    return IReduce.reduce(function(memo, f){
      return memo == null ? f(...args) : reduced(memo);
    }, null, fs);
  }
}

export function some(f, coll){
  let xs = ISeqable.seq(coll);
  while(xs){
    const value = f(ISeq.first(xs));
    if (value) {
      return value;
    }
    xs = INext.next(xs);
  }
  return null;
}

export const notSome = comp(not, some);
export const notAny  = notSome;

export function every(pred, coll){
  let xs = ISeqable.seq(coll);
  while(xs){
    if (!pred(ISeq.first(xs))){
      return false;
    }
    xs = INext.next(xs);
  }
  return true;
}

export const notEvery = comp(not, every);

export function mapSome(f, pred, coll){
  return IReduce.reduce(self, function(memo, value){
    return pred(value) ? f(value) : value;
  }, coll);
}

export function mapcat(f, colls){
  return concatenated(map(f, colls));
}

export function filter(pred, xs){
  return ISeqable.seq(xs) ? lazySeq(function(){
    let ys = xs;
    while (ISeqable.seq(ys)) {
      const head = ISeq.first(ys),
            tail = ISeq.rest(ys);
      if (pred(head)) {
        return cons(head, lazySeq(function(){
          return filter(pred, tail);
        }));
      }
      ys = tail;
    }
    return emptyList();
  }) : emptyList();
}

export const detect = comp(first, filter);

export function cycle(coll){
  return ISeqable.seq(coll) ? lazySeq(function(){
    return cons(ISeq.first(coll), concat(ISeq.rest(coll), cycle(coll)));
  }) : emptyList();
}

export function treeSeq(branch, children, root){
  function walk(node){
    return cons(node, branch(node) ? mapcat(walk, children(node)) : emptyList());
  }
  return walk(root);
}

export function flatten(coll){
  return filter(complement(satisfies(ISequential)), ISeq.rest(treeSeq(satisfies(ISequential), ISeqable.seq, coll)));
}

export function zip(...colls){
  return mapcat(identity, map(ISeqable.seq, ...colls));
}

export const filtera = comp(ICoerceable.toArray, filter);

export function remove(pred, xs){
  return filter(complement(pred), xs);
}

export function keep(f, xs){
  return filter(isSome, map(f, xs));
}

export function drop(n, coll){
  let i = n,
      xs = ISeqable.seq(coll)
  while (i > 0 && xs) {
    xs = ISeq.rest(xs);
    i = i - 1;
  }
  return xs;
}

export function dropWhile(pred, xs){
  return ISeqable.seq(xs) ? pred(ISeq.first(xs)) ? dropWhile(pred, ISeq.rest(xs)) : xs : emptyList();
}

export function dropLast(n, coll){
  return map(function(x, _){
    return x;
  }, coll, drop(n, coll));
}

export function take(n, coll){
  const xs = ISeqable.seq(coll);
  return n > 0 && xs ? lazySeq(function(){
    return cons(ISeq.first(xs), take(n - 1, ISeq.rest(xs)));
  }) : emptyList();
}

export function takeWhile(pred, xs){
  return ISeqable.seq(xs) ? lazySeq(function(){
    const item = ISeq.first(xs);
    return pred(item) ? cons(item, lazySeq(function(){
      return takeWhile(pred, ISeq.rest(xs));
    })) : emptyList();
  }) : emptyList();
}

export function takeNth(n, xs){
  return ISeqable.seq(xs) ? lazySeq(function(){
    return cons(ISeq.first(xs), takeNth(n, drop(n, xs)));
  }) : emptyList();
}

export function takeLast(n, coll){
  return n ? drop(ICounted.count(coll) - n, coll) : emptyList();
}

function interleave2(xs, ys){
  const as = ISeqable.seq(xs),
        bs = ISeqable.seq(ys);
  return as != null && bs != null ? cons(ISeq.first(as), lazySeq(function(){
    return cons(ISeq.first(bs), interleave2(ISeq.rest(as), ISeq.rest(bs)));
  })) : emptyList();
}

function interleaveN(...colls){
  return concatenated(interleaved(colls));
}

export function interleaved(colls){
  return ISeqable.seq(filter(isNil, colls)) ? emptyList() : lazySeq(function(){
    return cons(map(ISeq.first, colls), interleaved(map(INext.next, colls)));
  });
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
  if (!coll) return xs;
  const part = take(n, coll);
  return n === ICounted.count(part) ? cons(part, partition3(n, step, drop(step, coll))) : emptyList();
}

function partition4(n, step, pad, xs){
  const coll = ISeqable.seq(xs);
  if (!coll) return xs;
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
  if (!coll) return xs;
  return cons(take(n, coll), partitionAll3(n, step, drop(step, coll)));
}

export const partitionAll = overload(null, partitionAll1, partitionAll2, partitionAll3);

export function partitionBy(f, xs){
  const coll = ISeqable.seq(xs);
  if (!coll) return xs;
  const head = ISeq.first(coll),
        val  = f(head),
        run  = cons(head, takeWhile(function(x){
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

function dedupe1(coll){
  return dedupe2(identity, coll);
}

function dedupe2(f, coll){
  return dedupe3(f, IEquiv.equiv, coll);
}

function dedupe3(f, equiv, coll){
  return ISeqable.seq(coll) ? lazySeq(function(){
    let xs = ISeqable.seq(coll);
    const last = ISeq.first(xs);
    while(INext.next(xs) && equiv(f(ISeq.first(INext.next(xs))), f(last))) {
      xs = INext.next(xs);
    }
    return cons(last, dedupe2(f, INext.next(xs)));
  }) : coll;
}

export const dedupe = overload(null, dedupe1, dedupe2, dedupe3);

function repeatedly1(f){
  return lazySeq(function(){
    return cons(f(), repeatedly1(f));
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

function asc2(compare, f){
  return function(a, b){
    return compare(f(a), f(b));
  }
}

function asc1(f){
  return asc2(IComparable.compare, f);
}

export const asc = overload(constantly(IComparable.compare), asc1, asc2);

function desc0(){
  return function(a, b){
    return IComparable.compare(b, a);
  }
}

function desc2(compare, f){
  return function(a, b){
    return compare(f(b), f(a));
  }
}

function desc1(f){
  return desc2(IComparable.compare, f);
}

export const desc = overload(desc0, desc1, desc2);

function sort1(coll){
  return sort2(IComparable.compare, coll);
}

function sort2(compare, coll){
  return into([], coll).sort(compare);
}

function sortN(...args){
  const compares = initial(args),
        coll     = last(args);
  function compare(x, y){
    return IReduce.reduce(compares, function(memo, compare){
      return memo === 0 ? compare(x, y) : reduced(memo);
    }, 0);
  }
  return sort2(compare, coll);
}

export const sort = overload(null, sort1, sort2, sortN);

function sortBy2(keyFn, coll){
  return sortBy3(keyFn, IComparable.compare, coll);
}

function sortBy3(keyFn, compare, coll){
  return sort(function(x, y){
    return IComparable.compare(keyFn(x), keyFn(y));
  }, coll);
}

export const sortBy = overload(null, null, sortBy2, sortBy3);

export function withIndex(iter){
  return function(f, xs){
    let idx = -1;
    return iter(function(x){
      return f(++idx, x);
    }, xs);
  }
}

export const butlast     = partial(dropLast, 1);
export const initial     = butlast;
export const eachIndexed = withIndex(each);
export const mapIndexed  = withIndex(map);
export const keepIndexed = withIndex(keep);
export const splitAt     = juxt(take, drop);
export const splitWith   = juxt(takeWhile, dropWhile);

function braid3(f, xs, ys){
  return mapcat(function(x){
    return map(function(y){
      return f(x, y);
    }, ys);
  }, xs);
}

function braid4(f, xs, ys, zs){
  return mapcat(function(x){
    return mapcat(function(y){
      return map(function(z){
        return f(x, y, z);
      }, zs);
    }, ys);
  }, xs);
}

function braidN(f, xs, ...colls){
  if (ISeqable.seq(colls)) {
    return mapcat(function(x){
      return apply(braid, function(...args){
        return apply(f, x, args);
      }, colls);
    }, xs);
  } else {
    return map(f, xs || []);
  }
}

//Clojure's `for`; however, could not use the name as it's a reserved word in JavaScript.
export const braid = overload(null, null, map, braid3, braid4, braidN);

function best2(better, xs){
  const coll = ISeqable.seq(xs);
  return coll ? IReduce.reduce(ISeq.rest(coll), function(a, b){
    return better(a, b) ? a : b;
  }, ISeq.first(coll)) : null;
}

function best3(f, better, xs){
  const coll = ISeqable.seq(xs);
  return coll ? IReduce.reduce(ISeq.rest(coll), function(a, b){
    return better(f(a), f(b)) ? a : b;
  }, ISeq.first(coll)) : null;
}

export const best = overload(null, best2, best3);

function scan1(xs){
  return scan2(2, xs);
}

function scan2(n, xs){
  return lazySeq(function(){
    const ys = take(n, xs);
    return ICounted.count(ys) === n ? cons(ys, scan2(n, ISeq.rest(xs))) : emptyList();
  });
}

export const scan = overload(null, scan1, scan2);

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
  return lazySeq(function(){
    return cons(x, iterate(f, f(x)));
  });
}

export const integers  = range(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1);
export const positives = range(1, Number.MAX_SAFE_INTEGER, 1);
export const negatives = range(-1, Number.MIN_SAFE_INTEGER, -1);

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

export function generate(iterable){ //e.g. counter: generate(iterate(inc, 0)) or partial(generate, iterate(inc, 0))) for a counter factory;
  let iter = iterable[Symbol.iterator]();
  return function(){
    return iter.done ? null : iter.next().value;
  }
}

function splice4(self, start, nix, coll){
  return concat(take(start, self), coll, drop(start + nix, self))
}

function splice3(self, start, coll){
  return splice4(self, start, 0, coll);
}

export const splice = overload(null, null, null, splice3, splice4);

export function also(f, xs){
  return concat(xs, mapcat(function(x){
    const result = f(x);
    return satisfies(ISequential, result) ? result : [result];
  }, xs));
}

export function countBy(f, coll){
  return IReduce.reduce(coll, function(memo, value){
    let by = f(value),
        n  = memo[by];
    memo[by] = n ? inc(n) : 1;
    return memo;
  }, {});
}

function groupBy3(init, f, coll){
  return IReduce.reduce(coll, function(memo, value){
    return update(memo, f(value), function(group){
      return ICollection.conj(group || [], value);
    });
  }, init);
}

function groupBy2(f, coll){
  return groupBy3({}, f, coll);
}

export const groupBy = overload(null, null, groupBy2, groupBy3);

function index4(init, key, val, coll){
  return IReduce.reduce(coll, function(memo, x){
    return IAssociative.assoc(memo, key(x), val(x));
  }, init);
}

function index3(key, val, coll){
  return index4({}, key, val, coll);
}

function index2(key, coll){
  return index4({}, key, identity, coll);
}

export const index = overload(null, null, index2, index3, index4);

function lazyIterable1(iter){
  return lazyIterable2(iter, emptyList());
}

function lazyIterable2(iter, done){
  const res = iter.next();
  return res.done ? done : lazySeq(function(){
    return cons(res.value, lazyIterable1(iter));
  });
}

export const lazyIterable = overload(null, lazyIterable1, lazyIterable2);