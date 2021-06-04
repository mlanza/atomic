import {overload, toggles, identity, obj, partly, doto, does, branch, unspread, applying, execute, noop, constantly, once} from "./core";
import {IAppendable, IYankable, ICoerceable, IAssociative, IBounds, IInverse, ICloneable, ICollection, IComparable, ICounted, IDeref, IDisposable, IEmptyableCollection, IEquiv, IFind, IFn, IForkable, IFunctor, IHierarchy, IInclusive, IIndexed, IInsertable, IKVReduce, ILookup, IMap, IMapEntry, IMatchable, INext, IOtherwise, IPrependable, IReduce, IReset, ISeq, ISeqable, ISet, ISwap} from "./protocols";
import {just, satisfies, spread, maybe, each, duration, remove, sort, flip, realized, comp, isNumber, isFunction, apply, realize, isNil, reFindAll, mapkv, period, selectKeys, mapVals, reMatches, test, date, emptyList, cons, days, recurrence, curry, second as _second} from "./types";
import {filter} from "./types/lazy-seq";
import {add, subtract, compact, matches, name, descendants, query, locate, deref, get, assoc, yank, conj, reducing, toArray, reducekv, includes, excludes, rest, count, between, reduce, divide, fmap, split} from "./protocols/concrete";
import {isString, isBlank, str, replace} from "./types/string";
import {isSome} from "./types/nil";
import {implement} from "./types/protocol/concrete";
import {into, detect, map, mapa, splice, drop, join, some, last, lazySeq} from "./types/lazy-seq";
import {behaveAsSeries as _serieslike} from "./types/series/behave";
export const serieslike = _serieslike;
export {iterable} from "./types/lazy-seq/behave";
export * from "./core";
export * from "./types";
export * from "./protocols";
export * from "./protocols/concrete";
export * from "./predicates";
export * from "./associatives";
export {filter} from "./types/lazy-seq"; //necessary due to odd rollup behavior

import Set from 'set';

export const numeric = test(/^\d+$/i, ?);

function recurs2(pd, step) {
  return recurrence(IBounds.start(pd), IBounds.end(pd), step);
}

export const recurs = overload(null, recurs2(?, days(1)), recurs2);

export function inclusive(self){
  return new self.constructor(self.start, add(self.end, self.step), self.step, self.direction);
}

function cleanlyN(f, ...args){
  try {
    return f(...args);
  } catch {
    return null;
  }
}

export const cleanly = overload(null, curry(cleanlyN, 2), cleanlyN);

function mod3(obj, key, f){
  if (key in obj) {
    obj[key] = f(obj[key]); //must be a mutable copy
  }
  return obj;
}

function modN(obj, key, value, ...args){
  return args.length > 0 ? modN(mod3(obj, key, value), ...args) : mod3(obj, key, value);
}

const mod = overload(null, null, null, mod3, modN);

//Has the api of `assoc` and behaves like `update` persistently updating object attributes.  Depends on `clone` but not `lookup` or `assoc`.
export function edit(obj, ...args){
  const copy = ICloneable.clone(obj);
  args.unshift(copy);
  return modN.apply(copy, args);
}

export function deconstruct(dur, ...units){
  let memo = dur;
  return mapa(function(unit){
    const n = fmap(divide(memo, unit), Math.floor);
    memo = subtract(memo, fmap(unit, constantly(n)));
    return n;
  }, units);
}

export function toQueryString(obj){
  return just(obj, mapkv(str(?, "=", ?), ?), join("&", ?), collapse("?", ?));
}

export function fromQueryString(url){
  const params = {};
  each(function (match) {
    const key = decodeURIComponent(match[1]), val = decodeURIComponent(match[2]);
    params[key] = val;
  }, reFindAll(/[?&]([^=&]*)=([^=&]*)/g, url));
  return params;
}

export function unique(xs){
  return toArray(new Set(toArray(xs)));
}

export const second = branch(satisfies(ISeq, ?), comp(ISeq.first, INext.next), _second);

export function expands(f){
  function expand(...contents){
    return locate(contents, isFunction) ? postpone(...contents) : f(...contents);
  }
  function postpone(...contents){
    return function(value){
      const expanded = map(function(content){
        return isFunction(content) ? content(value) : content;
      }, contents);
      return apply(expand, expanded);
    }
  }
  return expand;
}

export function xarg(fn, n, f){
  return function(){
    arguments[n] = f(arguments[n]);
    return fn.apply(this, arguments);
  }
}

export function xargs(f, ...fs){
  return function(...args){
    return apply(f, map(execute, fs, args));
  }
}

function filled2(f, g){
  return function(...args){
    return ISeqable.seq(filter(isNil, args)) ? g(...args) : f(...args);
  }
}

function filled1(f){
  return filled2(f, noop);
}

export const filled = overload(null, filled1, filled2);

export function elapsed(self){
  return duration(end(self) - start(self));
}

export function collapse(...args){
  return some(isBlank, args) ? "" : join("", args);
}

function isNotConstructor(f){
  return isFunction(f) && !/^[A-Z]./.test(name(f));
}

//convenience for wrapping batches of functions.
export function impart(self, f){ //set retraction to identity to curb retraction overhead
  return reducekv(function(memo, key, value){
    return assoc(memo, key, isNotConstructor(value) ? f(value) : value);
  }, {}, self);
}

function include2(self, value){
  return toggles(conj(?, value), yank(?, value), includes(?, value), self);
}

function include3(self, value, want){
  return toggles(conj(?, value), yank(?, value), includes(?, value), self, want);
}

export const include = overload(null, null, include2, include3);

export const fmt = expands(str);

export function coalesce(...fs){
  return function(...args){
    return detect(isSome, map(applying(...args), fs));
  }
}

export function when(pred, ...xs) {
  return last(map(realize, pred ? xs : null));
}

export function readable(keys){
  const lookup = keys ? function(self, key){
    if (!includes(keys, key)) {
      throw new Error("Cannot read from " + key);
    }
    return self[key];
  } : function(self, key){
    return self[key];
  }
  return implement(ILookup, {lookup});
}

export function writable(keys){
  function clone(self){
    return Object.assign(Object.create(self.constructor.prototype), self);
  }
  function contains(self, key){
    return self.hasOwnProperty(key);
  }
  const assoc = keys ? function(self, key, value){
    if (!includes(keys, key) || !contains(self, key)) {
      throw new Error("Cannot write to " + key);
    }
    var tgt = clone(self);
    tgt[key] = value;
    return tgt;
  } : function(self, key, value){
    if (!contains(self, key)) {
      throw new Error("Cannot write to " + key);
    }
    var tgt = clone(self);
    tgt[key] = value;
    return tgt;
  }
  return does(
    implement(ICloneable, {clone}),
    implement(IAssociative, {assoc, contains}));
}