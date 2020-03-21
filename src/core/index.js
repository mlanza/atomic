import {overload, toggles, identity, obj, partly, doto, branch, unspread, applying, execute, noop} from "./core";
import {IAppendable, IYankable, ICoerceable, IAssociative, IBounds, IInverse, ICloneable, ICollection, IComparable, ICounted, IDeref, IDisposable, IEmptyableCollection, IEquiv, IFind, IFn, IForkable, IFunctor, IHierarchy, IInclusive, IIndexed, IInsertable, IKVReduce, ILookup, IMap, IMapEntry, IMatchable, INext, IOtherwise, IPrependable, IReduce, IReset, ISeq, ISeqable, ISet, ISwap} from "./protocols";
import {just, satisfies, filter, spread, maybe, each, duration, remove, sort, flip, realized, comp, isNumber, isFunction, apply, realize, isNil, reFindAll, mapkv, period, recurrence, selectKeys, mapVals, split, reMatches, test, date, emptyList, cons, days, second as _second} from "./types";
import {add, subtract, compact, matches, name, descendants, query, locate, deref, get, assoc, yank, conj, reducing, toArray, reducekv, includes, excludes, rest, count, between, reduce} from "./protocols/concrete";
import {isString, isBlank, str, replace} from "./types/string";
import {isSome} from "./types/nil";
import {into, detect, map, mapa, splice, drop, join, some, last, lazySeq} from "./types/lazy-seq";
import {absorb} from "./associatives";
import {_ as v} from "param.macro";
import {behaveAsSeries as _serieslike} from "./types/series/behave";
export const serieslike = _serieslike;
export {iterable} from "./types/lazy-seq/behave";
export * from "./core";
export * from "./types";
export * from "./protocols";
export * from "./protocols/concrete";
export * from "./predicates";
export * from "./associatives";
import Set from 'set';

export const global = window;

export const serialDate = /^\d{4}(-\d{2}(-\d{2}( \d{2}:\d{2}(:\d{2})?)?)?)?$/;
export const localDate  = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})Z?$/;
export const jsonDate   = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
export const timestamp  = /^\/*Date\((\-?\d+)\)\/*$/;
export const mdy        = /^(\d{1,2})\/(\d{1,2})\/(\d{2,5})( (\d{1,2}):(\d{2})[ ]?([ap]m)?)?$/i;
export const numeric    = /^\d+$/i;

export const fromSerialDate = comp(spread(date), split(v, /[-:. \/]/));
export const fromLocalDate  = comp(spread(date), mapa(parseInt, v), drop(1, v), reMatches(localDate, v));
export const fromJsonDate   = comp(date, reMatches(jsonDate, v));
export const fromTimestamp  = comp(date, parseInt, get(v, 1), reMatches(timestamp, v));
export const fromMDY = comp(spread(function(M, d, y, h, m, ampm){
  const mh = h != null ? h + (ampm == "pm" ? 12 : 0) : null;
  return new Date((y < 99 ? 2000 : 0) + y, M - 1, d, mh || 0, m || 0);
}), toArray, mapVals(v, parseInt, test(numeric, v)), toArray, splice(v, 3, 1, []), drop(1, v), reMatches(mdy, v));

//TODO remove!
export function week(obj, fdow){
  const firstDayOfWeek = fdow || 0,
        lastDayOfWeek = 7 - firstDayOfWeek,
        s       = IBounds.start(obj),
        e       = IBounds.end(obj),
        soffset = Math.abs(firstDayOfWeek - s.getDay()),
        eoffset = Math.abs(lastDayOfWeek  - e.getDay());
  return period(add(s, days(-soffset)), add(e, days(eoffset)));
}

export function periodically(start, end, step, round){
  const nxt = add(start, step);
  return IEquiv.equiv(start, end) ? emptyList() : round && nxt > end ? cons(recurrence(start, end, step)) : nxt <= end ? lazySeq(function(){
    return cons(recurrence(start, nxt, step), periodically(nxt, end, step, round));
  }) : emptyList();
}

function apart3(start, end, step, round){
  return duration(reduce(add, 0, map(function(pd){
    return IBounds.end(pd) - IBounds.start(pd);
  }, periodically(start, end, step, round))));
}

function apart2(start, end){
  return duration(end - start);
}

export const apart = overload(null, null, apart2, apart3);

export function toQueryString(obj){
  return just(obj, mapkv(str(v, "=", v), v), join("&", v), collapse("?", v));
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

export const second = branch(satisfies(ISeq, v), comp(ISeq.first, INext.next), _second);

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
  return toggles(conj(v, value), yank(v, value), includes(v, value), self);
}

function include3(self, value, want){
  return toggles(conj(v, value), yank(v, value), includes(v, value), self, want);
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