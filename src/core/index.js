import {overload, toggles, identity, obj, partly, doto, branch, unspread, applying, execute} from "./core";
import {IDecorated, IAppendable, IHash, ITemplate, IYank, ICoerce, IAssociative, IBounds, IInverse, ICloneable, ICollection, IComparable, ICounted, IDecode, IDeref, IDisposable, IEmptyableCollection, IEncode, IEquiv, IFind, IFn, IFork, IFunctor, IHierarchy, IInclusive, IIndexed, IInsertable, IKVReduce, ILookup, IMap, IMapEntry, IMatch, INext, IOtherwise, IPrependable, IReduce, IReset, IReversible, ISeq, ISeqable, ISet, ISteppable, ISwap} from "./protocols";
import {satisfies, filter, spread, specify, maybe, each, duration, remove, sort, flip, realized, comp, isNumber, isFunction, apply, realize} from "./types";
import {add, subtract, compact, matches, name, descendants, query, locate, transient, persistent, deref, get, assoc, yank, conj, hash, reducing, toArray, reducekv, includes, excludes} from "./protocols/concrete";
import {isString, isBlank, str} from "./types/string";
import {isSome} from "./types/nil";
import {into, detect, map, drop, join, some, last} from "./types/lazy-seq";
import {emptyTransientSet} from "./types/transient-set/construct";
import {absorb} from "./associatives";
import {_ as v} from "param.macro";
import _serieslike from "./types/series/behave";
export const serieslike = _serieslike;
export {iterable} from "./types/lazy-seq/behave";
export * from "./core";
export * from "./types";
export * from "./protocols";
export * from "./protocols/concrete";
export * from "./predicates";
export * from "./associatives";
export * from "./multimethods";

export const second = comp(ISeq.first, INext.next);

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

export function withMutations(self, f){
  return persistent(f(transient(self)));
}

export const fmt = expands(str);

export function unique(xs){
  return toArray(into(emptyTransientSet(), xs));
}

export function coalesce(...fs){
  return function(...args){
    return detect(isSome, map(applying(...args), fs));
  }
}

export function when(pred, ...xs) {
  return last(map(realize, pred ? xs : null));
}