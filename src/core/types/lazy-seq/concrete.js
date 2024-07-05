import {ISequential} from "../../protocols.js";
import {identity, multi, or, constantly, overload, complement, comp, partial, slice, applying, unspread, isFunction} from "../../core.js";
import {EmptyList, emptyList} from "../empty-list/construct.js";
import {emptyArray, array} from "../array/construct.js";
import {toArray} from "../array/concrete.js";
import {randInt, isEven} from "../number/concrete.js";
import {reduced} from "../reduced/construct.js";
import {not} from "../boolean.js";
import {isNil, isSome} from "../nil.js";
import {persistentMap} from "../persistent-map/construct.js";
import {cons} from "../list/construct.js";
import {maybe} from "../just/construct.js";
import {range} from "../range/construct.js";
import {str} from "../string/concrete.js";
import {juxt, apply} from "../function/concrete.js"; //MOD
import {lazySeq} from "../lazy-seq/construct.js";
import {Concatenated} from "../concatenated/construct.js";
import {satisfies} from "../protocol/concrete.js";
import * as p from "./protocols.js";
import {next} from "../../protocols/iseq/concrete.js";

export function concatenated(xs){
  const colls = filter2(p.seq, xs);
  return p.seq(colls) ? new Concatenated(colls) : emptyList();
}

export const concat = overload(emptyList, p.seq, unspread(concatenated));

function map1(f){ //transducer
  return function(rf){
    return overload(rf, rf, function(memo, value){
      return rf(memo, f(value));
    });
  }
}

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
  const seqs = map2(p.seq, tail);
  return notAny(isNil, seqs) ? lazySeq(function(){
    return cons(apply(f, mapa(p.first, seqs)), apply(mapN, f, mapa(p.rest, seqs)));
  }) : emptyList();
}

const map1m = multi(function(f){
  return isFunction(f) ? map1 : persistentMap;
});

export const map  = overload(persistentMap, map1m, map2, map3, mapN);
export const mapa = comp(toArray, map);

export function mapArgs(xf, f){
  return function(...args){
    return apply(f, args.map(maybe(?, xf)));
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
  return map2(function([key, value]){
    return f(key, value);
  }, entries(xs));
}

export function mapvk(f, xs){ //TODO necessary, given `mapkv`?
  return map2(function([key, value]){
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
    xs = next(xs);
  }
  return null;
}

function someFn1(p){
  function f1(x){
    return p(x);
  }
  function f2(x, y){
    return p(x) || p(y);
  }
  function f3(x, y, z){
    return p(x) || p(y) || p(z);
  }
  function fn(x, y, z, ...args){
    return f3(x, y, z) || some(p, args);
  }
  return overload(constantly(null), f1, f2, f3, fn);
}

function someFn2(p1, p2){
  function f1(x){
    return p1(x) || p2(x);
  }
  function f2(x, y){
    return p1(x) || p1(y) || p2(x) || p2(y);
  }
  function f3(x, y, z){
    return p1(x) || p1(y) || p1(z) || p2(x) || p2(y) || p2(z);
  }
  function fn(x, y, z, ...args){
    return f3(x, y, z) || some(or(p1, p2), args);
  }
  return overload(constantly(null), f1, f2, f3, fn);
}

function someFnN(...ps){
  function fn(...args){
    return some(or(...ps), args);
  }
  return overload(constantly(null), fn);
}

export const someFn = overload(null, someFn1, someFn2, someFnN);
export const notSome = comp(not, some);
export const notAny  = notSome;

export function every(pred, coll){
  let xs = p.seq(coll);
  while(xs){
    if (!pred(p.first(xs))){
      return false;
    }
    xs = next(xs);
  }
  return true;
}

export const notEvery = comp(not, every);

function mapSome2(f, pred){
  return function(rf){
    return overload(rf, rf, function(memo, value){
      return rf(memo, pred(value) ? f(value) : value);
    });
  }
}

function mapSome3(f, pred, coll){
  return map2(function(value){
    return pred(value) ? f(value) : value;
  }, coll);
}

export const mapSome = overload(null, null, mapSome2, mapSome3);

function mapcat1(f){ //transducer
  return comp(map1(f), p.cat());
}

function mapcat2(f, colls){
  return concatenated(map2(f, colls));
}

export const mapcat = overload(null, mapcat1, mapcat2);

function filter1(pred){ //transducer
  return function(rf){
    return overload(rf, rf, function(memo, value){
      return pred(value) ? rf(memo, value) : memo;
    });
  }
}

function filter2(pred, xs){
  return p.seq(xs) ? lazySeq(function(){
    let ys = xs;
    while (p.seq(ys)) {
      const head = p.first(ys),
            tail = p.rest(ys);
      if (pred(head)) {
        return cons(head, lazySeq(function(){
          return filter2(pred, tail);
        }));
      }
      ys = tail;
    }
    return emptyList();
  }) : emptyList();
}

export const filter = overload(null, filter1, filter2);

function detect1(pred){ //transducer
  return function(rf){
    return overload(rf, rf, function(memo, value){
      return pred(value) ? reduced(rf(memo, value)) : memo;
    });
  }
}

const detect2 = comp(p.first, filter2);

export const detect = overload(null, detect1, detect2);

export function detectIndex(pred, xs){
  const found = detect2(function([idx, x]){
    return pred(x);
  }, mapIndexed(function(idx, x){
    return [idx, x];
  }, xs));
  return found ? found[0] : null;
}

export function cycle(coll){
  return p.seq(coll) ? lazySeq(function(){
    return cons(p.first(coll), concat(p.rest(coll), cycle(coll)));
  }) : emptyList();
}

export function treeSeq(branch, children, root){
  function walk(node){
    return cons(node, branch(node) ? mapcat2(walk, children(node)) : emptyList());
  }
  return walk(root);
}

export function flatten(coll){
  return filter2(complement(satisfies(ISequential)), p.rest(treeSeq(satisfies(ISequential), p.seq, coll)));
}

export function zip(...colls){
  return mapcat2(identity, map2(p.seq, ...colls));
}

export const filtera = comp(toArray, filter);

const remove1 = comp(filter1, complement); //transducer

function remove2(pred, xs){
  return filter2(complement(pred), xs);
}

export const remove = overload(null, remove1, remove2);

function keep1(f){ //transducer
  return comp(map1(f), filter1(isSome));
}

function keep2(f, xs){
  return filter2(isSome, map2(f, xs));
}

export const keep = overload(null, keep1, keep2);

function drop1(n){ //transducer
  return function(rf){
    let dropping = n;
    return overload(rf, rf, function(memo, value){
      return dropping-- > 0 ? memo : rf(memo, value);
    });
  }
}

function drop2(n, coll){
  let i = n,
      xs = p.seq(coll)
  while (i > 0 && xs) {
    xs = p.rest(xs);
    i = i - 1;
  }
  return xs;
}

export const drop = overload(null, drop1, drop2);

function dropWhile1(pred){ //transducer
  return function(rf){
    let dropping = true;
    return overload(rf, rf, function(memo, value){
      !dropping || (dropping = pred(value));
      return dropping ? memo : rf(memo, value);
    });
  }
}

function dropWhile2(pred, xs){
  return p.seq(xs) ? pred(p.first(xs)) ? dropWhile(pred, p.rest(xs)) : xs : emptyList();
}

export const dropWhile = overload(null, dropWhile1, dropWhile2);

export function dropLast(n, coll){
  return map3(function(x, _){
    return x;
  }, coll, drop(n, coll));
}

function take1(n){ //transducer
  return function(rf){
    let taking = n < 0 ? 0 : n;
    return overload(rf, rf, function(memo, value){
      switch(taking){
        case 0:
          return reduced(memo)
        case 1:
          taking--;
          return reduced(rf(memo, value));
        default:
          taking--;
          return rf(memo, value);
      }
    });
  }
}

function take2(n, coll){
  const xs = p.seq(coll);
  return n > 0 && xs ? lazySeq(function(){
    return cons(p.first(xs), take2(n - 1, p.rest(xs)));
  }) : emptyList();
}

export const take = overload(null, take1, take2);

function takeWhile1(pred){ //transducer
  return function(rf){
    return overload(rf, rf, function(memo, value){
      return pred(value) ? rf(memo, value) : reduced(memo);
    });
  }
}

function takeWhile2(pred, xs){
  return p.seq(xs) ? lazySeq(function(){
    const item = p.first(xs);
    return pred(item) ? cons(item, lazySeq(function(){
      return takeWhile(pred, p.rest(xs));
    })) : emptyList();
  }) : emptyList();
}

export const takeWhile = overload(null, takeWhile1, takeWhile2);

function takeNth1(n){ //transducer
  return function(rf){
    let x = -1;
    return overload(rf, rf, function(memo, value){
      x++;
      return x === 0 || x % n === 0 ? rf(memo, value) : memo;
    });
  }
}

function takeNth2(n, xs){
  return p.seq(xs) ? lazySeq(function(){
    return cons(p.first(xs), takeNth(n, drop(n, xs)));
  }) : emptyList();
}

export const takeNth = overload(null, takeNth1, takeNth2);

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
  return p.seq(filter2(isNil, colls)) ? emptyList() : lazySeq(function(){
    return cons(map2(p.first, colls), interleaved(map2(next, colls)));
  });
}

export const interleave = overload(null, null, interleave2, interleaveN);

function interpose1(sep){
  return function(rf){
    return overload(rf, rf, function(memo, value){
      return rf(p.seq(memo) ? rf(memo, sep) : memo, value);
    });
  }
}

function interpose2(sep, xs){
  return drop2(1, interleave2(repeat1(sep), xs));
}

export const interpose = overload(null, interpose1, interpose2);

function partition2(n, xs){
  return partition3(n, n, xs);
}

function partition3(n, step, xs){
  const coll = p.seq(xs);
  if (!coll) return xs;
  const part = take2(n, coll);
  return n === p.count(part) ? cons(part, partition3(n, step, drop(step, coll))) : emptyList();
}

function partition4(n, step, pad, xs){
  const coll = p.seq(xs);
  if (!coll) return xs;
  const part = take2(n, coll);
  return n === p.count(part) ? cons(part, partition4(n, step, pad, drop(step, coll))) : cons(take2(n, concat(part, pad)));
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
  return cons(take2(n, coll), partitionAll3(n, step, drop2(step, coll)));
}

export const partitionAll = overload(null, partitionAll1, partitionAll2, partitionAll3);

export function partitionBy(f, xs){
  const coll = p.seq(xs);
  if (!coll) return xs;
  const head = p.first(coll),
        val  = f(head),
        run  = cons(head, takeWhile2(function(x){
          return val === f(x);
        }, next(coll)));
  return cons(run, partitionBy(f, p.seq(drop(p.count(run), coll))));
}

export function sift(pred, xs){
  const sifted = groupBy(pred, xs);
  return [sifted["true"] || null, sifted["false"] || null];
}

function lastN1(size = 1){ //transducer
  return function(rf){
    let prior = [];
    return overload(rf, function(memo){
      let acc = memo;
      for (let x of prior){
        acc = rf(acc, x);
      }
      return rf(acc);
    }, function(memo, value){
      prior.push(value);
      while (prior.length > size) {
        prior.shift();
      }
      return memo;
    });
  }
}

function lastN2(n, coll){
  let xs = coll, ys = [];
  while (p.seq(xs)) {
    ys.push(p.first(xs));
    while (ys.length > n) {
      ys.shift();
    }
    xs = next(xs)
  }
  return ys;
}

export const lastN = overload(null, lastN1, lastN2);

function last0(){
  return lastN1(1);
}

function last1(coll){
  let xs = coll, ys = null;
  while (ys = next(xs)) {
    xs = ys;
  }
  return p.first(xs);
}

export const last = overload(last0, last1);

function thin1(equiv){ //transducer
  const nil = {};
  return function(rf){
    let last = nil;
    return overload(rf, rf, function(memo, value){
      const result = last !== nil && equiv(value, last) ? memo : rf(memo, value);
      last = value;
      return result;
    });
  }
}

function thin2(equiv, coll){
  return p.seq(coll) ? lazySeq(function(){
    let xs = p.seq(coll);
    const last = p.first(xs);
    while(next(xs) && p.equiv(p.first(next(xs)), last)) {
      xs = next(xs);
    }
    return cons(last, thin2(p.equiv, next(xs)));
  }) : coll;
}

export const thin = overload(null, thin1, thin2);

function dedupe0(){ //transducer
  return thin1(p.equiv);
}

function dedupe1(coll){
  return thin2(p.equiv, coll);
}

export const dedupe = overload(dedupe0, dedupe1);

function repeatedly1(f){
  return lazySeq(function(){
    return cons(f(), repeatedly1(f));
  });
}


function repeatedly2(n, f){
  return take2(n, repeatedly1(f));
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

function keepIndexed1(f){ //transducer
  return comp(mapIndexed1(f), filter1(isSome));
}

function mapIndexed1(f){ //transducer
  return function(rf){
    let idx = -1;
    return overload(rf, rf, function(memo, value){
      return rf(memo, f(++idx, value));
    });
  }
}

export const butlast     = partial(dropLast, 1);
export const initial     = butlast;
export const mapIndexed  = overload(null, mapIndexed1, withIndex(map));
export const keepIndexed = overload(null, keepIndexed1, withIndex(keep));
export const splitAt     = juxt(take, drop);
export const splitWith   = juxt(takeWhile, dropWhile);

function braid3(f, xs, ys){
  return mapcat2(function(x){
    return map2(function(y){
      return f(x, y);
    }, ys);
  }, xs);
}

function braid4(f, xs, ys, zs){
  return mapcat2(function(x){
    return mapcat2(function(y){
      return map2(function(z){
        return f(x, y, z);
      }, zs);
    }, ys);
  }, xs);
}

function braidN(f, xs, ...colls){
  if (p.seq(colls)) {
    return mapcat2(function(x){
      return apply(braid, function(...args){
        return apply(f, x, args);
      }, colls);
    }, xs);
  } else {
    return map2(f, xs || []);
  }
}

//Clojure's `for`; however, could not use the name as it's a reserved word in JavaScript.
export const braid = overload(null, null, map, braid3, braid4, braidN);

function best1(better){ //transducer
  return function(rf){
    return overload(rf, rf, better);
  }
}

function best2(better, xs){
  const coll = p.seq(xs);
  return coll ? p.reduce(function(a, b){
    return better(a, b) ? a : b;
  }, p.first(coll), p.rest(coll)) : null;
}

export const best = overload(null, best1, best2);

export function scan(n, xs){ //TODO add transducer
  return lazySeq(function(){
    const ys = take2(n, xs);
    return p.count(ys) === n ? cons(ys, scan(n, p.rest(xs))) : emptyList();
  });
}

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


export function iterate(f, x){
  return lazySeq(function(){
    return cons(x, iterate(f, f(x)));
  });
}

export const integers  = range(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1);
export const positives = range(0, Number.MAX_SAFE_INTEGER, 1);
export const negatives = range(-1, Number.MIN_SAFE_INTEGER, -1);

function randNth1(coll){
  return randNth2(Math.random, coll);
}

function randNth2(random = Math.random, coll){
  return p.nth(coll, randInt(random, p.count(coll)));
}

export const randNth = overload(null, randNth1, randNth2);

export const pluck = randNth;

export function cond(...xs){
  const conditions = isEven(p.count(xs)) ? xs : Array.from(concat(butlast(xs), [constantly(true), last(xs)]));
  return function(...args){
    return p.reduce(function(memo, condition){
      const pred = p.first(condition);
      return pred(...args) ? reduced(p.first(p.rest(condition))) : memo;
    }, null, partition2(2, conditions));
  }
}

function join1(xs){
  return into("", map2(str, xs));
}

function join2(sep, xs){
  return join1(interpose(sep, xs));
}

export const join = overload(null, join1, join2);

function shuffle2(f, coll) {
  let a = Array.from(coll);
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(f() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function shuffle1(coll){
  return shuffle2(Math.random, coll);
}

export const shuffle = overload(null, shuffle1, shuffle2);

export function generate(iterable){ //e.g. counter: generate(iterate(inc, 0)) or partial(generate, iterate(inc, 0))) for a counter factory;
  let iter = iterable[Symbol.iterator]();
  return function(){
    return iter.done ? null : iter.next().value;
  }
}

function splice4(self, start, nix, coll){
  return concat(take2(start, self), coll, drop2(start + nix, self))
}

function splice3(self, start, coll){
  return splice4(self, start, 0, coll);
}

export const splice = overload(null, null, null, splice3, splice4);

export function also(f, xs){
  return concat(xs, mapcat2(function(x){
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
    return detect2(isSome, map2(applying(...args), fs));
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
