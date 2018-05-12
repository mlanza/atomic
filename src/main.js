import "./types";
import {implement} from "./protocol";
import Empty, {EMPTY} from "./types/empty";
import List, {cons} from "./types/list";
import {juxt, slice, constantly, overload, identity, partial, reducing, complement, comp, upperCase, lowerCase, isArray, EMPTY_ARRAY} from "./core";
import LazySeq, {lazySeq} from "./types/lazyseq";
import Reduced, {reduced} from "./types/reduced";
import Observable, {observable} from "./types/observable";
import Concatenated, {concatenated, concat as concatN} from "./types/concatenated";
import {next} from "./protocols/inext";
import {dissoc, isMap} from "./protocols/imap";
import {first, rest, isSeq} from "./protocols/iseq";
import {toArray} from "./protocols/iarr";
import {seq, isSeqable} from "./protocols/iseqable";
import {isSequential} from "./protocols/isequential";
import {conj} from "./protocols/icollection";
import {count} from "./protocols/icounted";
import {nth, isIndexed} from "./protocols/iindexed";
import IDisposable from "./protocols/idisposable";
import {show} from "./protocols/ishow";
import {lookup} from "./protocols/ilookup";
import {sub} from "./protocols/isubscribe";
import {pub} from "./protocols/ipublish";
import {assoc, contains} from "./protocols/iassociative";
import {reduce} from "./protocols/ireduce";
import {reducekv} from "./protocols/ikvreduce";
import {compare} from "./protocols/icomparable";
import {reduce as reduceIndexed, isNil, doto} from "./core";
import {inc, dec} from "./protocols/ioffset";
import * as t from "./transducers";

export {observable};
export {isEven, log, unbind, slice, isArray, lowerCase, upperCase, trim, overload, identity, constantly, partial, complement, comp, multimethod, doto} from "./core";
export * from "./protocol";
export * from "./protocols";
export {time, milliseconds, seconds, hours, days, weeks, months, years} from "./types/duration"
import {record} from "./types/record";
export {record};

export const int = parseInt;
export const float = parseFloat;
export const num = Number;
export const boolean = Boolean;

function transduce3(xform, f, coll){
  return transduce4(xform, f, f(), coll);
}

function transduce4(xform, f, init, coll){
  return reduce(xform(f), init, coll);
}

export const transduce = overload(null, null, null, transduce3, transduce4);

function into2(to, from){
  return reduce(conj, to, from);
}

function into3(to, xform, from){
  return transduce(xform, conj, to, from);
}

export const into = overload(constantly(EMPTY_ARRAY), identity, into2, into3);

function everyPair(pred, xs){
  var every = xs.length > 0;
  while(every && xs.length > 1){
    every = pred(xs[0], xs[1]);
    xs = slice(xs, 1);
  }
  return every;
}

export function not(x){
  return !x;
}

function lt2(a, b){
  return a < b;
}

function ltN(...args){
  return everyPair(lt2, args);
}

export const lt = overload(constantly(false), constantly(true), lt2, ltN);

function lte2(a, b){
  return a <= b;
}

function lteN(...args){
  return everyPair(lte2, args);
}

export const lte = overload(constantly(false), constantly(true), lte2, lteN);


function gt2(a, b){
  return a > b;
}

function gtN(...args){
  return everyPair(gt2, args);
}

export const gt = overload(constantly(false), constantly(true), gt2, gtN);

function gte2(a, b){
  return a >= b;
}

function gteN(...args){
  return everyPair(gte2, args);
}

export const gte = overload(constantly(false), constantly(true), gte2, gteN);

function eq2(a, b){
  return a === b;
}

function eqN(...args){
  return everyPair(eq2, args);
}

export const eq = overload(constantly(true), constantly(true), eq2, eqN);

function notEq2(a, b){
  return a !== b;
}

function notEqN(...args){
  return !everyPair(eq2, args);
}

export const notEq = overload(constantly(true), constantly(true), notEq2, notEqN);

function equal2(a, b){
  return a == b;
}

function equalN(...args){
  return everyPair(equal2, args);
}

export const equal = overload(constantly(true), constantly(true), equal2, equalN);

export function mod(num, div){
  return num % div;
}

export function isBoolean(b){
  return Boolean(b) === b;
}

export function isNumber(n){
  return Number(n) === n;
}

export function isInteger(n){
  return Number(n) === n && n % 1 === 0;
}

export const isInt = isInteger;

export function isFloat(n){
  return Number(n) === n && n % 1 !== 0;
}

export function get(self, key, notFound){
  return lookup(self, key) || notFound;
}

export function getIn(self, keys, notFound){
  return reduceIndexed(keys, get, self) || notFound;
}

export function assocIn(self, keys, value){
  var key = keys[0];
  switch (keys.length) {
    case 0:
      return self;
    case 1:
      return assoc(self, key, value);
    default:
      return assoc(self, key, assocIn(get(self, key), toArray(rest(keys)), value));
  }
}

function update3(self, key, f){
  return assoc(self, key, f(get(self, key)));
}

function update4(self, key, f, a){
  return assoc(self, key, f(get(self, key), a));
}

function update5(self, key, f, a, b){
  return assoc(self, key, f(get(self, key), a, b));
}

function update6(self, key, f, a, b, c){
  return assoc(self, key, f(get(self, key), a, b, c));
}

function updateN(self, key, f){
  var tgt  = get(self, key),
      args = [tgt].concat(slice(arguments, 3));
  return assoc(self, key, f.apply(this, args));
}

export const update = overload(null, null, null, update3, update4, update5, update6, updateN);

function updateIn3(self, keys, f){
  var k = keys[0], ks = toArray(rest(keys));
  return ks.length ? assoc(self, k, updateIn3(get(self, k), ks, f)) : update3(self, k, f);
}

function updateIn4(self, keys, f, a){
  var k = keys[0], ks = toArray(rest(keys));
  return ks.length ? assoc(self, k, updateIn4(get(self, k), ks, f, a)) : update4(self, k, f, a);
}

function updateIn5(self, keys, f, a, b){
  var k = keys[0], ks = toArray(rest(keys));
  return ks.length ? assoc(self, k, updateIn5(get(self, k), ks, f, a, b)) : update5(self, k, f, a, b);
}

function updateIn6(self, key, f, a, b, c){
  var k = keys[0], ks = toArray(rest(keys));
  return ks.length ? assoc(self, k, updateIn6(get(self, k), ks, f, a, b, c)) : update6(self, k, f, a, b, c);
}

function updateInN(self, keys, f) {
  return updateIn3(self, keys, function(obj){
    var args = toArray(rest(slice(arguments)));
    return f.apply(null, [obj].concat(args));
  });
}

export const updateIn = overload(null, null, null, updateIn3, updateIn4, updateIn5, updateIn6, updateInN);

export function second(xs){
  return first(next(xs));
}

export function isEmpty(coll){
  return !seq(coll);
}

export function notEmpty(coll){
  return isEmpty(coll) ? null : coll;
}

export const concat = overload(constantly(EMPTY), seq, concatN);

export function each(f, xs){
  var ys = seq(xs);
  while(ys){
    f(first(ys));
    ys = seq(rest(ys));
  }
}

function apply2(f, args){
  return f.apply(null, toArray(args));
}

function apply3(f, a, args){
  return f.apply(null, [a].concat(toArray(args)));
}

function apply4(f, a, b, args){
  return f.apply(null, [a, b].concat(toArray(args)));
}

function apply5(f, a, b, c, args){
  return f.apply(null, [a, b, c].concat(toArray(args)));
}

function applyN(f, a, b, c, d, args){
  return f.apply(null, [a, b, c, d].concat(toArray(args)));
}

export const apply = overload(null, null, apply2, apply3, apply4, apply5, applyN);

export function some(pred, coll){
  var xs = seq(coll);
  while(xs && !pred(first(xs))){
    xs = next(xs);
  }
  return !!xs;
}

export const notSome = comp(not, some);
export const notAny = notSome;

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

function map2(f, xs){
  return seq(xs) ? lazySeq(f(first(xs)), function(){
    return map2(f, rest(xs));
  }) : EMPTY;
}

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

export const map = overload(null, t.map, map2, map3, mapN);

function dedupe1(coll){
  var xs = seq(coll);
  const last = first(xs);
  return xs ? lazySeq(last, function(){
    while(next(xs) && first(next(xs)) === last) {
      xs = next(xs);
    }
    return dedupe1(next(xs));
  }) : EMPTY;
}

export const dedupe = overload(t.dedupe, dedupe1);

function take2(n, coll){
  const xs = seq(coll);
  return n > 0 && xs ? lazySeq(first(xs), function(){
    return take2(n - 1, rest(xs));
  }) : EMPTY;
}

export const take = overload(null, t.take, take2);

function repeatedly1(f){
  return lazySeq(f(), function(){
    return repeatedly1(f);
  });
}

function repeatedly2(n, f){
  return take2(n, repeatedly1(f));
}

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
  })
}

function add2(x, y){
  return x + y;
}

function subtract2(x, y){
  return x - y;
}

function multiply2(x, y){
  return x * y;
}

function divide2(x, y){
  return x / y;
}

function subtract1(x){
  return subtract2(0, x);
}

function divide1(x){
  return divide2(1, x);
}

function str1(x){
  return x == null ? "" : x.toString();
}

function str2(x, y){
  return str1(x) + str1(y);
}

function min2(x, y){
  return x < y ? x : y;
}

function max2(x, y){
  return x > y ? x : y;
}

export const min = overload(null, identity, min2, reducing(min2));
export const max = overload(null, identity, max2, reducing(max2));
export const str = overload(constantly(""), str1, str2, reducing(str2));
export const add = overload(constantly(0), identity, add2, reducing(add2));
export const subtract = overload(constantly(0), subtract1, subtract2, reducing(subtract2));
export const multiply = overload(constantly(1), identity, multiply2, reducing(multiply2));
export const divide = overload(null, divide1, divide2, reducing(divide2));
//export const inc = partial(add2, +1);
//export const dec = partial(add2, -1);

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

export function integers(){
  return iterate(inc, 1);
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
  return filter2(isNil, colls) === EMPTY ? lazySeq(map2(first, colls), function(){
    return interleaved(map2(next, colls));
  }) : EMPTY;
}

export const interleave = overload(null, null, interleave2, interleaveN);

function drop2(n, coll){
  var i = n,
      xs = seq(coll)
  while (i > 0 && xs) {
    xs = rest(xs);
    i = i - 1;
  }
  return xs;
}

export const drop = overload(null, t.drop, drop2);

function interpose2(sep, xs){
  return drop2(1, interleave2(repeat1(sep), xs));
}

export const interpose = overload(null, t.interpose, interpose2);

export const repeatedly = overload(null, repeatedly1, repeatedly2);

export function cycle(coll){
  return seq(coll) ? lazySeq(first(coll), function(){
    return concat(rest(coll), cycle(coll));
  }) : EMPTY;
}

function filter2(pred, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const head = first(coll);
  return pred(head) ? lazySeq(head, function(){
    return filter2(pred, rest(coll));
  }) : filter2(pred, rest(coll));
}

const filter = overload(null, t.filter, filter2);

function keep2(f, xs){
  return filter2(isSome, map2(f, xs));
}

const keep = overload(null, t.keep, keep2);

export function indexed(iter){
  return function(f, xs){
    var idx = -1;
    return iter(function(x){
      return f(++idx, x);
    }, xs);
  }
}


const mapIndexed2  = indexed(map2);

export const mapIndexed  = overload(null, t.mapIndexed, mapIndexed2);

const keepIndexed2 = indexed(keep2);

export const keepIndexed = overload(null, t.keepIndexed, keepIndexed2);

function remove2(pred, xs){
  return filter2(complement(pred), xs);
}

export const remove  = overload(null, t.remove, remove2);

const compact1 = partial(filter2, identity);

export const compact = overload(t.compact, compact1);

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

export const partition = overload(null, null, partition2, partition3, partition4);

export function partitionAll2(n, xs){
  return partitionAll3(n, n, xs);
}

export function partitionAll3(n, step, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  return cons(take(n, coll), partition3(n, step, drop(step, coll)));
}

export const partitionAll = overload(null, null, partitionAll2, partitionAll3); //TODO transducer

function partitionBy2(f, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const head = first(coll),
        val  = f(head),
        run  = cons(head, takeWhile2(function(x){
          return val === f(x);
        }, next(coll)));
  return cons(run, partitionBy2(f, seq(drop(count(run), coll))));
}

export const partitionBy = overload(null, null, partitionBy2); //TODO transducer

function takeWhile2(pred, xs){
  if (!seq(xs)) return EMPTY;
  const item = first(xs);
  return pred(item) ? lazySeq(item, function(){
    return takeWhile2(pred, rest(xs));
  }) : EMPTY;
}

export const takeWhile = overload(null, t.takeWhile, takeWhile2);

function takeNth2(n, xs){
  return seq(xs) ? lazySeq(first(xs), function(){
    return takeNth2(n, drop2(n, xs));
  }) : EMPTY;
}

export const takeNth = overload(null, t.takeNth, takeNth2);


function dropWhile2(pred, xs){
  return seq(xs) ? pred(first(xs)) ? dropWhile2(pred, rest(xs)) : xs : EMPTY;
}

export const dropWhile = overload(null, t.dropWhile, dropWhile2);


export function filtera(pred, coll){
  return toArray(filter(pred, coll));
}

export function mapa(f, coll){
  return toArray(map(f, coll));
}

function mapcat1(f){
  return comp(map(f), t.cat);
}

function mapcat2(f, colls){
  return concatenated(map(f, colls));
}

export const mapcat = overload(null, mapcat1, mapcat2);

function fnil1(f, A){
  return function(a){
    var args = slice(arguments);
    if (isNil(a)) { args[0] = A };
    return f.apply(null, args);
  }
}

function fnil2(f, A, B){
  return function(a, b){
    var args = slice(arguments);
    if (isNil(a)) { args[0] = A };
    if (isNil(b)) { args[1] = B };
    return f.apply(null, args);
  }
}

function fnil3(f, A, B, C){
  return function(a, b, c){
    var args = slice(arguments);
    if (isNil(a)) { args[0] = A };
    if (isNil(b)) { args[1] = B };
    if (isNil(c)) { args[2] = C };
    return f.apply(null, args);
  }
}

function fnilN(f){
  var ARGS = slice(arguments, 1);
  return function(){
    var args = slice(arguments);
    for(var x = 0; x < args.length; x++){
      if (isNil(args[x])) { args[x] = ARGS[x] };
    }
    return f.apply(null, args);
  }
}

export const fnil = overload(null, null, fnil1, fnil2, fnil3, fnilN);

export function last(coll){
  var tail = coll;
  while (tail = next(tail)){
    if (!next(tail)) {
      break;
    }
  }
  return first(tail);
}

export function takeLast(n, coll){
  return n ? drop(count(coll) - n, coll) : EMPTY;
}

function dropLast2(n, coll){
  return map(function(x, _){
    return x;
  }, coll, drop(n, coll));
}

const dropLast1 = partial(dropLast2, 1);

export const dropLast = overload(null, dropLast1, dropLast2);

export function selectKeys(obj, keys){
  return reduce(function(memo, key){
    memo[key] = get(obj, key);
    return memo;
  }, {}, keys);
}

export function scanKey(better){
  function scanKey2(k, x){
    return x;
  }

  function scanKey3(k, x, y){
    return better(k(x), k(y)) ? x : y;
  }

  function scanKeyN(k, x){
    return apply(reduce, scanKey2, x, slice(arguments, 2));
  }

  return overload(null, null, scanKey2, scanKey3, scanKeyN);
}

export const maxKey = scanKey(gt);
export const minKey = scanKey(lt);

export function everyPred(){
  var preds = slice(arguments);
  return function(){
    return reduce(function(memo, arg){
      return reduce(function(memo, pred){
        var result = memo && pred(arg);
        return result ? result : reduced(result);
      }, memo, preds);
    }, true, slice(arguments))
  }
}

export function treeSeq(branch, children, root){
  function walk(node){
    return cons(node, branch(node) ? mapcat(walk, children(node)) : EMPTY);
  }
  return walk(root);
}

export function flatten(x){
  return filter(complement(isSequential), rest(treeSeq(isSequential, seq, x)));
}

export function isInstance(constructor, x){
  return x instanceof constructor;
}

function sort1(coll){
  return into([], coll).sort();
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

function isDistinct2(x, y){
  return x !== y;
}

function isDistinctN(...xs){
  const s = new Set(xs);
  return s.size === xs.length;
}

export const isDistinct = overload(null, constantly(true), isDistinct, isDistinctN);

function distinct1(coll){
  return Array.from(new Set(coll));
}

export const distinct = overload(t.distinct, distinct1);
export const splitAt = juxt(take2, drop2);
export const splitWith = juxt(takeWhile2, dropWhile2);

function groupInto(seed, f, coll){
  return reduce(function(memo, value){
    return update(memo, f(value), function(group){
      return conj(group || [], value);
    });
  }, seed, coll);
}

export function groupBy(f, coll){
  return groupInto({}, f, coll);
}

export function merge(...maps){
  return some(identity, maps) ? reduce(function(memo, map){
    return reduce(function(memo, pair){
      const key = pair[0], value = pair[1];
      memo[key] = value;
      return memo;
    }, memo, seq(map));
  }, {}, maps) : null;
}

export function mergeWith(f, ...maps){
  return some(identity, maps) ? reduce(function(memo, map){
    return reduce(function(memo, pair){
      const key = pair[0], value = pair[1];
      return contains(memo, key) ? update(memo, key, function(prior){
        return f(prior, value);
      }) : assoc(memo, key, value);
    }, memo, seq(map));
  }, {}, maps) : null;
}

function duct(source, xf, sink){
  const unsub = sub(source, partial(xf(pub), sink));
  return doto(sink,
    implement(IDisposable, {dispose: unsub}));
}

function signal1(source){
  return duct(source, map(identity), observable());
}

function signal2(source, xf){
  return signal3(source, xf, null);
}

function signal3(source, xf, init){
  return duct(source, xf, observable(init));
}

export const signal = overload(null, signal1, signal2, signal3);

function someFn1(a){
  return function(){
    return apply(a, arguments);
  }
}

function someFn2(a, b){
  return function(){
    return apply(a, arguments) || apply(b, arguments);
  }
}

function someFn3(a, b, c){
  return function(){
    return apply(a, arguments) || apply(b, arguments) || apply(c, arguments);
  }
}

function someFnN(...preds){
  return function(...args){
    return reduce(function(result, pred){
      let r = apply(pred, args);
      return r ? Reduced(r) : result;
    }, false, preds);
  }
}

export const someFn = overload(null, someFn1, someFn2, someFn3, someFnN);

function rand0(){
  return Math.random();
}

function rand1(n){
  return Math.random() * n;
}

export const rand = overload(rand0, rand1);

export function randInt(n){
  return Math.floor(rand(n));
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