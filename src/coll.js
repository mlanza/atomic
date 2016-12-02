import * as c from  './core';
import {complement, identity, isSome, supply, overload, constantly, partial, add, is, slice, pipe, arity, unspread, juxt, key, val, reducing, isIdentical} from './core';
import {satisfies} from './protocol';
import {seq} from './protocols/seqable';
import {first, rest} from './protocols/seq';
import {equiv} from './protocols/equiv';
import Collection from './protocols/collection';
import Emptyable from './protocols/emptyable';
import Next from './protocols/next';
import {get} from './protocols/lookup';
import {count} from './protocols/counted';
import {assoc, hasKey} from './protocols/associative';
import Associative from './protocols/associative';
import Comparable from './protocols/comparable';
import Reversible from './protocols/reversible';
import {reduce} from './protocols/reduce';
import {reduceKv} from './protocols/reduce-kv';
import DirectedSlice from './types/directed-slice';
import Reduced from './types/reduced';
import List from './types/list';
import LazyList from './types/lazy-list';
import {EMPTY} from './types/empty';

export function matches(template, obj){
  return reduceKv(template, function(memo, key, value){
    return memo ? obj[key] == value : new Reduced(memo);
  }, true);
}

export function join(xs){
  return _into("", map(str, xs));
}

export function joinWith(sep, xs){
  return join(interpose(sep, xs));
}

export function cons(head, tail){
  return new List(head, tail || EMPTY);
}

export function consN(){
  var coll = arguments[arguments.length - 1],
      adds = new DirectedSlice(arguments, arguments.length - 2, 0);
  return reduce(adds, function(memo, value){
    return new List(value, memo);
  }, coll);
}

export function partition(n, xs){
  return partitionStep(n, n, xs);
}

export function partitionStep(n, step, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const part = take(n, coll);
  return n === count(part) ? cons(part, partitionStep(n, step, drop(step, coll))) : EMPTY;
}

export function partitionStepPad(n, step, pad, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const part = take(n, coll);
  return n === count(part) ? cons(part, partitionStepPad(n, step, pad, drop(step, coll))) : new List(take(n, concat(part, pad)));
}

export function partitionAll(n, xs){
  return partitionAllStep(n, n, xs);
}

export function partitionAllStep(n, step, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  return cons(take(n, coll), partitionStep(n, step, drop(step, coll)));
}

export function partitionBy(f, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const fst = first(coll),
        val = f(fst),
        run = cons(fst, takeWhile(function(x){
          return val === f(x);
        }, Next.next(coll)));
  return cons(run, partitionBy(f, seq(drop(count(run), coll))));
}

export function assocN(obj, ...kvs){
  return reduce(partition(2, kvs), function(memo, pair){
    return assoc(memo, pair[0], pair[1]);
  }, obj);
}

export function dissocN(obj, ...keys){
  return reduce(keys, function(memo, key){
    return Associative.dissoc(memo, key);
  }, obj);
}

export function group(seed, v, k, xs){
  return reduce(xs, function(memo, x){
    var key = k(x), value = v(x);
    if (hasKey(memo, key)) {
      get(memo, key).push(value);
    } else {
      assoc(memo, key, [value]);
    }
    return memo;
  }, seed());
}

export const groupBy = partial(group, function(){
  return new Map();
}, identity);

export function update(obj, key, f, ...args){
  const value = get(obj, key);
  return assoc(obj, key, f.apply(this, [value].concat(args)));
}

export function updateIn(obj, path, f, ...args){
  return path.length > 1 ? update.apply(this, [obj, path[0], updateIn, slice(path, 1), f].concat(args)) : update.apply(this, [obj, path[0], f].concat(args));
}

export function assocIn(obj, path, value){
  const init = slice(path, 0, path.length - 1),
        key  = path[path.length - 1];
  return updateIn(obj, init, function(x){
    return assoc(x, key, value);
  }, value);
}

export function getIn(obj, path){
  return reduce(path, function(memo, key){
    const found = get(memo, key);
    return found == null ? new Reduced(null) : found;
  }, obj);
}

export const second = pipe(rest, first);

export function coll(value){
  return value == null ? [] : satisfies(Seqable, value) ? value : [value];
}

export function last(xs){
  return reduce(xs, function(memo, x){
    return x;
  }, null);
}

export function dotimes(n, f){
  for(var i = 0; i < n; i++) {
    f(i);
  }
}

export function doall(xs){
  var coll = xs;
  while(coll = seq(coll)){
    first(coll);
    coll = rest(coll);
  }
}

export function doallTimes(n, xs){
  var coll = xs;
  while((coll = seq(coll)) && n > 0) {
    first(coll);
    coll = rest(coll);
    n--;
  }
}

export function str(obj){
  return obj == null ? "" : obj.toString();
}

export function strN(){
  return _into("", map(str, arguments));
}

export function dropLast(n, xs){
  return mapN(identity, xs, drop(n, xs));
}

export const butlast = partial(dropLast, 1);

export function takeLast(n, xs){
  var coll = seq(xs),
      lead = seq(drop(n, xs));
  while (true){
    if (lead){
      coll = next(coll);
      lead = next(lead);
    } else {
      return coll;
    }
  }
}

export const splitAt = juxt(take, drop);
export const splitWith = juxt(takeWhile, dropWhile);

export function compare(x, y){
  if (x === y)   return 0;
  if (x == null) return -1;
  if (y == null) return -1;
  return Comparable.compare(x, y);
}

export function isEmpty(xs){
  return xs == null || !seq(xs);
}

export function sortWith(compare, xs){
  var arr = is(Array, xs) ? slice(xs) : toArray(xs);
  arr.sort(compare);
  return arr;
}

export function sort(xs){
  return sortWith(compare, xs);
}

export function sortBy(f, xs){
  return sortByWith(f, compare, xs);
}

export function sortByWith(f, compare, xs){
  return sortWith(function(x, y){
    return compare(f(x), f(y));
  }, xs);
}

export function interpose(sep, xs){
  const coll = seq(xs),
        fst  = first(coll);
  if (!coll) return EMPTY;
  const nxt = Next.next(coll);
  return nxt ? new LazyList(fst, function(){
    return nxt ? new LazyList(sep, function(){
      return interpose(sep, nxt);
    }) : EMPTY;
  }) : new List(fst);
}

function _interleave(){
  if (arguments.length < 2) return EMPTY;
  const coll   = map(seq, arguments),
        firsts = map(first, coll),
        nexts  = map(Next.next, coll);
  return isEvery(isSome, firsts) ? nexts ? new LazyList(firsts, function(){
    return _interleave.apply(this, toArray(nexts));
  }) : new List(firsts) : EMPTY;
}

export function interleave(){
  return cat(_interleave.apply(this, arguments));
}

export function iterator(xs){
  var coll = seq(xs);
  return {
    next: function(){
      var resp = {value: first(coll), done: !coll};
      coll = Next.next(coll);
      return resp;
    }
  }
}

export function each(f, xs){
  var coll = xs;
  while(coll = seq(coll)){
    f(first(coll));
    coll = rest(coll);
  }
}

export function map(f, xs){
  var coll = seq(xs);
  return coll ? new LazyList(f(first(coll)), function(){
    return map(f, rest(coll));
  }) : EMPTY;
}

export function mapN(f, ...colls){
  return isEvery(seq, colls) ? new LazyList(f.apply(this, toArray(map(first, colls))), function(){
    var args = [f].concat(toArray(map(rest, colls))),
        m    = args.length > 2 ? mapN : map;
    return m.apply(this, args);
  }) : EMPTY;
}

export function mapIndexed(f, xs){
  var idx = -1;
  return map(function(x){
    return f(++idx, x);
  }, xs);
}

export function keepIndexed(f, xs){
  var idx = -1;
  return filter(isSome, map(function(x){
    return f(++idx, x);
  }, xs));
}

export function keep(f, xs){
  return filter(isSome, map(f, xs));
}

export function merge(){
  return reduce(arguments, function(memo, xs){
    return reduce(xs || {}, function(memo, pair){
      memo[pair[0]] = pair[1];
      return memo;
    }, memo);
  }, {});
}

export function mergeWith(f, ...objs){
  return reduce(arguments, function(memo, xs){
    return reduce(xs || {}, function(memo, pair){
      if (memo.hasOwnProperty(pair[0])) {
        memo[pair[0]] = pair[1];
      } else {
        memo[pair[0]] = f(memo[pair[0]], pair[1]);
      }
      return memo;
    }, memo);
  }, {});
}

export function condp(value, pred, ...conds){
  return first(map(function(pair){
    return pair[1];
  }, filter(function(pair){
    return pred(value, pair[0]);
  }, partition(2, conds)))) || (isOdd(conds.length) ? conds[conds.length - 1] : null);
}

export function fnil(f, ...defaults){
  return function(){
    const defaulted = mapIndexed(function(idx, value){
      return value == null ? defaults[idx] : value;
    }, arguments);
    return f.apply(this, defaulted);
  }
}

export const selectKeys = Set ? function(keys, obj){
  var set = new Set(keys);
  return toObject(filter(function(pair){
    return set.has(pair[0]);
  }, obj));
} : function(keys, obj){
  return toObject(filter(function(pair){
    return some(partial(eq, pair[0]), keys);
  }, obj));
}

export function take(n, xs){
  return n > 0 && seq(xs) ? new LazyList(first(xs), function(){
    return take(n - 1, rest(xs));
  }) : EMPTY;
}

export function takeWhile(pred, xs){
  if (!seq(xs)) return EMPTY;
  const item = first(xs);
  return pred(item) ? new LazyList(item, function(){
    return takeWhile(pred, rest(xs));
  }) : EMPTY;
}

export function takeNth(n, xs){
  return seq(xs) ? new LazyList(first(xs), function(){
    return takeNth(n, drop(n, xs));
  }) : EMPTY;
}

export function drop(n, xs){
  var remaining = n;
  return dropWhile(function(){
    return remaining-- > 0;
  }, xs);
}

export function dropWhile(pred, xs){
  return seq(xs) ? pred(first(xs)) ? dropWhile(pred, rest(xs)) : xs : EMPTY;
}

export function some(pred, xs){
  return reduce(xs, function(memo, value){
    return memo ? new Reduced(memo) : pred(value);
  }, null) || null;
}

export function someFn(){
  const fs = arguments;
  return function(){
    return arguments.length ? !!some(function(x){
      return some(supply(x), fs) ? x : null;
    }, arguments) : null;
  }
}

export function everyPred(){
  const preds = arguments;
  return function(){
    return arguments.length ? isEvery(function(x){
      return isEvery(function(pred){
        return pred(x);
      }, preds);
    }, arguments) : true;
  }
}

export function keys(xs){
  const coll = seq(xs);
  return coll ? map(key, coll) : EMPTY;
}

export function vals(xs){
  const coll = seq(xs);
  return coll ? map(val, coll) : EMPTY;
}

export function scan(pred, xs){
  if (!seq(xs)) return true;
  const fst  = first(xs),
        rst  = rest(xs),
        coll = seq(rst);
  return coll ? pred(fst, first(coll)) && scan(pred, rst) : true;
}

export function equivSeq(as, bs){
  const xs = seq(as),
        ys = seq(bs);
  return xs == ys || (equiv(first(xs), first(ys)) && equiv(rest(xs), rest(ys)));
}

export function eq(a, b){
  return a == null ? b == null : isIdentical(a, b) || equiv(a, b);
}

export const ne = complement(eq);

export function gt(x, y){
  return x > y;
}

export function gte(x, y){
  return x >= y;
}

export function lt(x, y){
  return x < y;
}

export function lte(x, y){
  return x <= y;
}

export function scanning(f){
  return function(...xs){
    return scan(f, xs);
  }
}

export function expanding(f){
  return function(){
    const fxs = juxt.apply(this, arguments);
    return function(){
      return f.apply(this, fxs.apply(this, arguments));
    }
  }
}

export function pre(f, ...conds){
  var check = all.apply(this, conds);
  return function(){
    if (!check.apply(this, arguments))
      throw new TypeError("Failed pre-condition");
    return f.apply(this, arguments);
  }
}

export function post(f, ...conds){
  var check = all.apply(this, conds);
  return function(){
    var result = f.apply(this, arguments);
    if (!check(result))
      throw new TypeError("Failed post-condition.");
    return result;
  }
}

export function isEvery(pred, xs){
  if (!seq(xs)) return true;
  return pred(first(xs)) && isEvery(pred, rest(xs));
}

export function isNotEvery(pred, xs){
  return isEvery(complement(pred), xs);
}

export function isAny(pred, xs){
  return some(pred, xs) !== null;
}

export function isNotAny(pred, xs){
  return !isAny(pred, xs);
}

export function filter(pred, xs){
  var coll = seq(xs);
  if (!coll) return EMPTY;
  var fst = first(coll);
  return pred(fst) ? new LazyList(fst, function(){
    return filter(pred, rest(coll));
  }) : filter(pred, rest(coll));
}

export function remove(pred, xs){
  return filter(complement(pred), xs);
}

export function compact(xs){
  return filter(identity, xs);
}

export function detect(pred, xs){
  return first(filter(pred, xs));
}

export function flatten(xs){
  if (!seq(xs)) return EMPTY;
  var fst = first(xs),
      rst = rest(xs);
  return satisfies(Seqable, fst) ? flatten(concat(fst, rst)) : new LazyList(fst, function(){
    return flatten(rst);
  });
}

export function reverse(xs){
  return is(Reversible, xs) ? rseq(xs) : reduce(xs, Collection.conj, EMPTY);
}

export function cat(xs){
  const ys = seq(xs);
  const coll = seq(compact(map(seq, ys)));
  if (!coll) return EMPTY;
  const fst = first(coll);
  return new LazyList(first(fst), function(){
    const rst = rest(coll);
    return seq(fst) ? cat([rest(fst)].concat(toArray(rst))) : cat(rst);
  });
}

export function concat(){
  return cat(arguments);
}

export function mapcat(f, xs){
  return cat(map(f, xs));
}

export function best(pred, xs){
  const coll = seq(xs);
  return coll ? reduce(rest(coll), function(a, b){
    return pred(a, b) ? a : b;
  }, first(coll)) : null;
}

export const most  = partial(best, gt);
export const least = partial(best, lt);
export const max   = unspread(most);
export const min   = unspread(least);

export function toArray(xs){
  return xs instanceof Array ? xs : _into([], xs);
}

export function toObject(obj){
  if (obj == null) return {};
  if (obj.constructor === Object) return obj;
  var coll = seq(obj);
  if (!coll) return {};
  return reduce(coll, Collection.conj, {});
}

export function iterate(generate, seed){
  return new LazyList(seed, function(){
    return iterate(generate, generate(seed));
  });
}

export function repeatedly(f){
  return iterate(f, f());
}

export function repeatedlyN(n, f){
  return n > 0 ? new LazyList(f(), function(){
    return repeatedlyN(n - 1, f);
  }) : EMPTY;
}

export function repeat(value){
  return repeatedly(constantly(value));
}

export function repeatN(n, value){
  return repeatedlyN(n, constantly(value))
}

function _cycle(xs, ys){
  if (arguments.length === 1) return _cycle(xs, xs);
  var coll = seq(xs) || seq(ys);
  return coll ? new LazyList(first(coll), function(){
    return _cycle(rest(coll), ys);
  }) : EMPTY;
}

export const cycle = arity(1, _cycle);

function _dedupe(xs, x){
  const coll = seq(xs),
        fst  = first(coll);
  return coll ? fst === x ?  _dedupe(rest(coll), fst) : new LazyList(fst, function(){
    return _dedupe(rest(coll), fst);
  }) : EMPTY;
}

export const dedupe = arity(1, _dedupe);

export function distinct(xs){
  var coll = seq(xs);
  return coll ? toArray(new Set(coll)) : EMPTY;
}

export const range = overload(function(){ //TODO number range, date range, string range, etc.
  return iterate(inc, 0);
}, function(end){
  return range(0, end);
}, function(start, end){
  return range(start, end, 1);
}, function(start, end, step){
  return start < end ? new LazyList(start, function(){
    return range(start + step, end, step);
  }) : EMPTY;
});

export function seeding(f, init){
  return overload(init, identity, f);
}

function _into(to, from){
  return from ? reduce(from, Collection.conj, to) : to;
}

function _intoX(to, xform, from){
  return transduce4(xform, Collection.conj, to, from);
}

export const into = overload(constantly([]), identity, _into, _intoX);

function _transduce3(xform, f, coll){
  var xf = xform(f);
  return xf(reduce(coll, xf, xf()));
}

function _transduce4(xform, f, seed, coll){
  return _transduce3(xform, seeding(f, constantly(seed)), coll);
}

export const transduce = overload(null, null, null, _transduce3, _transduce4);

export function expansive(f){
  var isFn = partial(is, Function);
  function expand(args, value){
    if (isFn(value)){
      return pipe(value, partial(expand, args));
    }
    while(some(isFn, args)){
      args = map(function(arg){
        return isFn(arg) ? arg(value) : arg;
      }, args)
    }
    return f.apply(this, toArray(args));
  }
  return function(){
    var args = slice(arguments);
    return some(isFn, args) ? partial(expand, args) : f.apply(this, args);
  }
}