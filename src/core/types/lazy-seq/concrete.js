import {ISequential} from "../../protocols.js";
import {identity, constantly, overload, complement, comp, partial, slice, applying, unspread} from "../../core.js";
import {EmptyList, emptyList} from "../empty-list/construct.js";
import {emptyArray, array} from "../array/construct.js";
import {toArray} from "../array/concrete.js";
import {randInt, isEven} from "../number/concrete.js";
import {reduced} from "../reduced/construct.js";
import {not} from "../boolean.js";
import {isNil, isSome} from "../nil.js";
import {cons} from "../list/construct.js";
import {maybe} from "../just/construct.js";
import {range} from "../range/construct.js";
import {str} from "../string/concrete.js";
import {juxt, apply} from "../function/concrete.js"; //MOD
import {lazySeq} from "../lazy-seq/construct.js";
import {Concatenated} from "../concatenated/construct.js";
import {satisfies} from "../protocol/concrete.js";
import * as p from "./protocols.js";

export function concatenated(xs){
  const colls = filter(p.seq, xs);
  return p.seq(colls) ? new Concatenated(colls) : emptyList();
}

export const concat = overload(emptyList, p.seq, unspread(concatenated));

function map2(f, xs){
  return p.seq(xs) ? lazySeq(function(){
    return cons(f(p.first(xs)), map2(f, p.rest(xs)));
  }) : emptyList();
}

function map3(f, c1, c2){
  const s1 = p.seq(c1),
        s2 = p.seq(c2);
  return s1 && s2 ? lazySeq(function(){
    return cons(f(p.first(s1), p.first(s2)), map3(f, p.rest(s1), p.rest(s2)));
  }) : emptyList();
}

function map4(f, c1, c2, c3){
  const s1 = p.seq(c1),
        s2 = p.seq(c2),
        s3 = p.seq(c3);
  return s1 && s2 && s3 ? lazySeq(function(){
    return cons(f(p.first(s1), p.first(s2), p.first(s3)), map4(f, p.rest(s1), p.rest(s2), p.rest(s3)));
  }) : emptyList();
}

function mapN(f, ...tail){
  const seqs = map(p.seq, tail);
  return notAny(isNil, seqs) ? lazySeq(function(){
    return cons(apply(f, mapa(p.first, seqs)), apply(mapN, f, mapa(p.rest, seqs)));
  }) : emptyList();
}

export const map  = overload(null, null, map2, map3, mapN);
export const mapa = comp(toArray, map);

export function mapArgs(xf, f){
  return function(){
    return apply(f, mapa(maybe(?, xf), slice(arguments)));
  }
}

export function keyed(f, keys){
  return p.reduce(function(memo, key){
    return p.assoc(memo, key, f(key));
  }, {}, keys);
}

function transduce3(xform, f, coll){
  return transduce4(xform, f, f(), coll);
}

function transduce4(xform, f, init, coll){
  const step = xform(f);
  return step(p.reduce(step, init, coll));
}

export const transduce = overload(null, null, null, transduce3, transduce4);

function into2(to, from){
  return p.reduce(p.conj, to, from);
}

function into3(to, xform, from){
  return transduce(xform, p.conj, to, from);
}

export const into = overload(emptyArray, identity, into2, into3);

//TODO unnecessary if CQS pattern is that commands return self
function doing1(f){
  return doing2(f, identity);
}

function doing2(f, order){
  return function(self, ...xs){
    each(f(self, ?), order(xs));
  }
}

export const doing = overload(null, doing1, doing2); //mutating counterpart to `reducing`

export function each(f, xs){
  let ys = p.seq(xs);
  while(ys){
    f(p.first(ys));
    ys = p.next(ys);
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
    if (p.seq(colls)) {
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
  return p.seq(keys) ? lazySeq(function(){
    return cons([p.first(keys), p.get(xs, p.first(keys))], entries2(xs, p.rest(keys)));
  }) : emptyList();
}

function entries1(xs){
  return entries2(xs, p.keys(xs));
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
    return p.reduce(function(memo, f){
      return memo == null ? f(...args) : reduced(memo);
    }, null, fs);
  }
}

export function some(f, coll){
  let xs = p.seq(coll);
  while(xs){
    const value = f(p.first(xs));
    if (value) {
      return value;
    }
    xs = p.next(xs);
  }
  return null;
}

export const notSome = comp(not, some);
export const notAny  = notSome;

export function every(pred, coll){
  let xs = p.seq(coll);
  while(xs){
    if (!pred(p.first(xs))){
      return false;
    }
    xs = p.next(xs);
  }
  return true;
}

export const notEvery = comp(not, every);

export function mapSome(f, pred, coll){
  return map(function(value){
    return pred(value) ? f(value) : value;
  }, coll);
}

export function mapcat(f, colls){
  return concatenated(map(f, colls));
}

export function filter(pred, xs){
  return p.seq(xs) ? lazySeq(function(){
    let ys = xs;
    while (p.seq(ys)) {
      const head = p.first(ys),
            tail = p.rest(ys);
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

export const detect = comp(p.first, filter);

export function cycle(coll){
  return p.seq(coll) ? lazySeq(function(){
    return cons(p.first(coll), concat(p.rest(coll), cycle(coll)));
  }) : emptyList();
}

export function treeSeq(branch, children, root){
  function walk(node){
    return cons(node, branch(node) ? mapcat(walk, children(node)) : emptyList());
  }
  return walk(root);
}

export function flatten(coll){
  return filter(complement(satisfies(ISequential)), p.rest(treeSeq(satisfies(ISequential), p.seq, coll)));
}

export function zip(...colls){
  return mapcat(identity, map(p.seq, ...colls));
}

export const filtera = comp(toArray, filter);

export function remove(pred, xs){
  return filter(complement(pred), xs);
}

export function keep(f, xs){
  return filter(isSome, map(f, xs));
}

export function drop(n, coll){
  let i = n,
      xs = p.seq(coll)
  while (i > 0 && xs) {
    xs = p.rest(xs);
    i = i - 1;
  }
  return xs;
}

export function dropWhile(pred, xs){
  return p.seq(xs) ? pred(p.first(xs)) ? dropWhile(pred, p.rest(xs)) : xs : emptyList();
}

export function dropLast(n, coll){
  return map(function(x, _){
    return x;
  }, coll, drop(n, coll));
}

export function take(n, coll){
  const xs = p.seq(coll);
  return n > 0 && xs ? lazySeq(function(){
    return cons(p.first(xs), take(n - 1, p.rest(xs)));
  }) : emptyList();
}

export function takeWhile(pred, xs){
  return p.seq(xs) ? lazySeq(function(){
    const item = p.first(xs);
    return pred(item) ? cons(item, lazySeq(function(){
      return takeWhile(pred, p.rest(xs));
    })) : emptyList();
  }) : emptyList();
}

export function takeNth(n, xs){
  return p.seq(xs) ? lazySeq(function(){
    return cons(p.first(xs), takeNth(n, drop(n, xs)));
  }) : emptyList();
}

export function takeLast(n, coll){
  return n ? drop(p.count(coll) - n, coll) : emptyList();
}

function interleave2(xs, ys){
  const as = p.seq(xs),
        bs = p.seq(ys);
  return as != null && bs != null ? cons(p.first(as), lazySeq(function(){
    return cons(p.first(bs), interleave2(p.rest(as), p.rest(bs)));
  })) : emptyList();
}

function interleaveN(...colls){
  return concatenated(interleaved(colls));
}

export function interleaved(colls){
  return p.seq(filter(isNil, colls)) ? emptyList() : lazySeq(function(){
    return cons(map(p.first, colls), interleaved(map(p.next, colls)));
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
  const coll = p.seq(xs);
  if (!coll) return xs;
  const part = take(n, coll);
  return n === p.count(part) ? cons(part, partition3(n, step, drop(step, coll))) : emptyList();
}

function partition4(n, step, pad, xs){
  const coll = p.seq(xs);
  if (!coll) return xs;
  const part = take(n, coll);
  return n === p.count(part) ? cons(part, partition4(n, step, pad, drop(step, coll))) : cons(take(n, concat(part, pad)));
}

export const partition = overload(null, null, partition2, partition3, partition4);

export function partitionAll1(n){
  return partial(partitionAll, n);
}

export function partitionAll2(n, xs){
  return partitionAll3(n, n, xs);
}

export function partitionAll3(n, step, xs){
  const coll = p.seq(xs);
  if (!coll) return xs;
  return cons(take(n, coll), partitionAll3(n, step, drop(step, coll)));
}

export const partitionAll = overload(null, partitionAll1, partitionAll2, partitionAll3);

export function partitionBy(f, xs){
  const coll = p.seq(xs);
  if (!coll) return xs;
  const head = p.first(coll),
        val  = f(head),
        run  = cons(head, takeWhile(function(x){
          return val === f(x);
        }, p.next(coll)));
  return cons(run, partitionBy(f, p.seq(drop(p.count(run), coll))));
}

function last1(coll){
  let xs = coll, ys = null;
  while (ys = p.next(xs)) {
    xs = ys;
  }
  return p.first(xs);
}

function last2(n, coll){
  let xs = coll, ys = [];
  while (p.seq(xs)) {
    ys.push(p.first(xs));
    while (ys.length > n) {
      ys.shift();
    }
    xs = p.next(xs)
  }
  return ys;
}

export const last = overload(null, last1, last2);

function dedupe1(coll){
  return dedupe2(identity, coll);
}

function dedupe2(f, coll){
  return dedupe3(f, p.equiv, coll);
}

function dedupe3(f, equiv, coll){
  return p.seq(coll) ? lazySeq(function(){
    let xs = p.seq(coll);
    const last = p.first(xs);
    while(p.next(xs) && equiv(f(p.first(p.next(xs))), f(last))) {
      xs = p.next(xs);
    }
    return cons(last, dedupe2(f, p.next(xs)));
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
  return !p.seq(coll);
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
  return asc2(p.compare, f);
}

export const asc = overload(constantly(p.compare), asc1, asc2);

function desc0(){
  return function(a, b){
    return p.compare(b, a);
  }
}

function desc2(compare, f){
  return function(a, b){
    return compare(f(b), f(a));
  }
}

function desc1(f){
  return desc2(p.compare, f);
}

export const desc = overload(desc0, desc1, desc2);

function sort1(coll){
  return sort2(p.compare, coll);
}

function sort2(compare, coll){
  return into([], coll).sort(compare);
}

function sortN(...args){
  const compares = initial(args),
        coll     = last(args);
  function compare(x, y){
    return p.reduce(function(memo, compare){
      return memo === 0 ? compare(x, y) : reduced(memo);
    }, 0, compares);
  }
  return sort2(compare, coll);
}

export const sort = overload(null, sort1, sort2, sortN);

function sortBy2(keyFn, coll){
  return sortBy3(keyFn, p.compare, coll);
}

function sortBy3(keyFn, compare, coll){
  return sort(function(x, y){
    return p.compare(keyFn(x), keyFn(y));
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
  if (p.seq(colls)) {
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
  const coll = p.seq(xs);
  return coll ? p.reduce(function(a, b){
    return better(a, b) ? a : b;
  }, p.first(coll), p.rest(coll)) : null;
}

function best3(f, better, xs){
  const coll = p.seq(xs);
  return coll ? p.reduce(function(a, b){
    return better(f(a), f(b)) ? a : b;
  }, p.first(coll), p.rest(coll)) : null;
}

export const best = overload(null, best2, best3);

function scan1(xs){
  return scan2(2, xs);
}

function scan2(n, xs){
  return lazySeq(function(){
    const ys = take(n, xs);
    return p.count(ys) === n ? cons(ys, scan2(n, p.rest(xs))) : emptyList();
  });
}

export const scan = overload(null, scan1, scan2);

function isDistinct1(coll){
  let seen = new Set();
  return p.reduce(function(memo, x){
    if (memo && seen.has(x)) {
      return reduced(false);
    }
    seen.add(x);
    return memo;
  }, true, coll);
}

function isDistinctN(...xs){
  return isDistinct1(xs);
}

export const isDistinct = overload(null, constantly(true), function(a, b){
  return a !== b;
}, isDistinctN);

function dorun1(coll){
  let xs = p.seq(coll);
  while(xs){
    xs = p.next(xs);
  }
}

function dorun2(n, coll){
  let xs = p.seq(coll);
  while(xs && n > 0){
    n++;
    xs = p.next(xs);
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
  return p.nth(coll, randInt(p.count(coll)));
}

export function cond(...xs){
  const conditions = isEven(p.count(xs)) ? xs : Array.from(concat(butlast(xs), [constantly(true), last(xs)]));
  return function(...args){
    return p.reduce(function(memo, condition){
      const pred = p.first(condition);
      return pred(...args) ? reduced(p.first(p.rest(condition))) : memo;
    }, null, partition(2, conditions));
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
  return p.reduce(function(memo, value){
    let by = f(value),
        n  = memo[by];
    memo[by] = n ? p.inc(n) : 1;
    return memo;
  }, {}, coll);
}

function groupBy3(init, f, coll){
  return p.reduce(function(memo, value){
    return p.update(memo, f(value), function(group){
      return p.conj(group || [], value);
    });
  }, init, coll);
}

function groupBy2(f, coll){
  return groupBy3({}, f, coll);
}

export const groupBy = overload(null, null, groupBy2, groupBy3);

function index4(init, key, val, coll){
  return p.reduce(function(memo, x){
    return p.assoc(memo, key(x), val(x));
  }, init, coll);
}

function index3(key, val, coll){
  return index4({}, key, val, coll);
}

function index2(key, coll){
  return index4({}, key, identity, coll);
}

export const index = overload(null, null, index2, index3, index4);

export function coalesce(...fs){
  return function(...args){
    return detect(isSome, map(applying(...args), fs));
  }
}

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
