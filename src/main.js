import {overload, identity, counter} from "./core";
import {reducing} from "./types/reduced";
import {sort} from "./types/lazyseq";
import {chain} from "./types/pipeline";
import {IAppendable, IHash, IYank, IArray, IAssociative, IBounds, IConverse, ICloneable, ICollection, IComparable, IContent, ICounted, IDecode, IDeref, IDisposable, IEmptyableCollection, IEncode, IEquiv, IEvented, IFind, IFn, IHierarchy, IInclusive, IIndexed, IKVReduce, ILookup, IMap, IMapEntry, INext, IObject, IPrependable, IPublish, IReduce, IReset, IReversible, ISeq, ISeqable, ISet, IShow, ISteppable, ISubscribe, ISwap, IUnit} from "./protocols";
import {fork} from "./predicates";
import {hash} from "./encode";

import * as T from "./types";
import * as d from "./dom";

export * from "./clojure";
export * from "./core";
export * from "./types";
export * from "./protocols";
export * from "./predicates";
export * from "./associative";
export * from "./lookup";
export * from "./swap";
export * from "./reduce";
export * from "./reducekv";
export * from "./encode";
export * from "./decode";
export * from "./contents";
export * from "./merge";
export * from "./mergeWith";
export * from "./patch";
export * from "./associatives";
export * from "./signals";
export * from "./multimethods";
export * from "./dom";

export const start = IBounds.start;
export const end = IBounds.end;
export const pub = IPublish.pub;
export const sub = ISubscribe.sub;
export const show = IShow.show;
export const second = T.comp(ISeq.first, INext.next);
export const deref = IDeref.deref;
export const reverse = IReversible.reverse;
export const clone = ICloneable.clone;
export const dispose = IDisposable.dispose;
export const empty = IEmptyableCollection.empty;
export const equiv = IEquiv.equiv;
export const conj = overload(identity, ICollection.conj, reducing(ICollection.conj));
export const toObject = IObject.toObject;
export const reset = IReset.reset;
export const on = IEvented.on;
export const off = IEvented.off;
export const find = IFind.find;
export const invoke = IFn.invoke;
export const parent = IHierarchy.parent;
export const children = IHierarchy.children;
export const nextSibling = IHierarchy.nextSibling;
export const prevSibling = IHierarchy.prevSibling;
export const compare = IComparable.compare;
export const toArray = IArray.toArray;
export const contains = IAssociative.contains;
export const append = overload(null, identity, IAppendable.append, reducing(IAppendable.append));
export const prepend = overload(null, identity, IPrependable.prepend, reducing(IPrependable.prepend));
export const step = ISteppable.step;
export const converse = IConverse.converse;
export const unit = IUnit.unit;
export const includes = IInclusive.includes;
export const nth = IIndexed.nth;
export const keys = IMap.keys;
export const vals = IMap.vals;
export const key = IMapEntry.key;
export const val = IMapEntry.val;
export const seq = ISeqable.seq;
export const first = ISeq.first;
export const rest = ISeq.rest;
export const count = ICounted.count;
export const next = INext.next;
export const superset = ISet.superset;
export const disj = ISet.disj;
export const union = overload(T.set, identity, ISet.union, reducing(ISet.union));
export const intersection = overload(null, null, ISet.intersection, reducing(ISet.intersection));
export const difference = overload(null, null, ISet.difference, reducing(ISet.difference));

export function subset(subset, superset){
  return ISet.superset(superset, subset);
}

export function add1(self){
  return ISteppable.step(IUnit.unit(self), self);
}

export function add2(self, amount){
  return ISteppable.step(IUnit.unit(self, amount), self);
}

export const add = overload(null, add1, add2, reducing(add2));

export function subtract1(self){
  return ISteppable.step(IConverse.converse(IUnit.unit(self)), self);
}

export function subtract2(self, amount){
  return ISteppable.step(IConverse.converse(IUnit.unit(self, amount)), self);
}

export const subtract = overload(null, subtract1, subtract2, reducing(subtract2));

function dissocN(obj, ...keys){
  return IReduce.reduce(keys, IMap.dissoc, obj);
}

export const dissoc = overload(null, identity, IMap.dissoc, dissocN);

export const appendTo  = T.realized(T.flip(IAppendable.append));
export const prependTo = T.realized(T.flip(IPrependable.prepend));
export const transpose = fork(IInclusive.includes, IYank.yank, ICollection.conj);

function memoize1(f){
  return memoize2(f, function(...args){
    return hash(args);
  });
}

function memoize2(f, hash){
  const cache = {};
  return function(...args){
    const key = hash(...args);
    if (cache.hasOwnProperty(key)) {
      return cache[key];
    } else {
      const result = f(...args);
      cache[key] = result;
      return result;
    }
  }
}

export const memoize = overload(null, memoize1, memoize2);

/*
export * from "./pointfree";
import * as _ from "./pointfree";

function checkStatus(resp){
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

export const request = _.chain(_.request,
  _.prepend(function(params){
    return Object.assign({
      credentials: "same-origin",
      method: "GET",
      headers: {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose"
      }
    }, params);
  }),
  _.append(checkStatus),
  _.append(function(resp){
    return resp.json();
  }),
  _.append(_.getIn(["d", "results"])));
*/
