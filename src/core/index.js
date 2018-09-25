import {overload, toggles, identity, obj, partly, doto, branch, unspread, applying} from "./core";
import {IDecorated, IAppendable, IHash, ITemplate, IYank, IArray, IAssociative, IBounds, IInverse, ICloneable, ICollection, IComparable, ICounted, IDecode, IDeref, IDisposable, IEmptyableCollection, IEncode, IEquiv, IFind, IFn, IFork, IFunctor, IHierarchy, IInclusive, IIndexed, IInsertable, IKVReduce, ILookup, IMap, IMapEntry, IMatch, INext, IObject, IOtherwise, IPrependable, IReduce, IReset, IReversible, ISeq, ISeqable, ISet, ISteppable, ISwap} from "./protocols";
import {satisfies, filter, spread, specify, maybe, each, see, isEmpty, duration, compact, remove, flatten, map, sort, flip, realized, comp, isNumber, mapSomeVals, isFunction, apply} from "./types";
import {matches, name, descendants, query, locate, transient, persistent, deref, get, assoc, yank, conj, hash, otherwise, fmap, reducing, reducekv, includes, excludes} from "./protocols/concrete";
import {isString, str} from "./types/string";
import {and, unless} from "./predicates";
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

function add2(self, n){
  return ISteppable.step(n, self);
}

export const add = overload(null, null, add2, reducing(add2));

function subtract2(self, n){
  return ISteppable.step(IInverse.inverse(n), self);
}

export const subtract = overload(null, null, subtract2, reducing(subtract2));

export function argumented(f, g){
  return comp(spread(f), unspread(g));
}

export function expansive(f){
  const expand = argumented(
    branch(unspread(locate(v, isFunction)), postpone, f),
    comp(IArray.toArray, compact, flatten));
  function postpone(...contents){
    return function(value){
      const resolve = isFunction(value) ? comp(value, v) : applying(value);
      return expand(...map(branch(isFunction, resolve, identity), contents));
    }
  }
  return expand;
}

export function elapsed(self){
  return duration(end(self) - start(self));
}

export function envelop(before, after){
  return unless(isEmpty, comp(IPrependable.prepend(v, before), IAppendable.append(v, after)));
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

export function opt(value, ...fs){
  return otherwise(fmap(maybe(value), ...fs), null);
}

export function withMutations(self, f){
  return persistent(f(transient(self)));
}

export const fmt = expansive(str);