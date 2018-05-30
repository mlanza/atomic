import {overload, identity} from "./core";
import {reducing} from "./types/reduced";
import {IAppendable, IArr, IAssociative, ICloneable, ICollection, IComparable, IContent, ICounted, IDeref, IDisposable, IEmptyableCollection, IEquiv, IEvented, IFind, IFn, IHierarchicalSet, IHierarchy, IInclusive, IIndexed, IKVReduce, ILookup, IMap, IMapEntry, INext, IObj, IPrependable, IPublish, IReduce, IReset, IReversible, ISeq, ISeqable, ISet, IShow, ISteppable, ISubscribe, ISwap, IUnit} from "./protocols";
import * as T from "./types";
import * as t from "./transducers";
import * as d from "./dom";

export const transducers = { //TODO remove in final
  cat: t.cat,
  compact: t.compact,
  dedupe: t.dedupe,
  detect: t.detect,
  distinct: t.distinct,
  drop: t.drop,
  dropWhile: t.dropWhile,
  filter: t.filter,
  interpose: t.interpose,
  keep: t.keep,
  keepIndexed: t.keepIndexed,
  map: t.map,
  mapcat: t.mapcat,
  mapIndexed: t.mapIndexed,
  remove: t.remove,
  splay: t.splay,
  take: t.take,
  takeNth: t.takeNth,
  takeWhile: t.takeWhile
}

export * from "./clojure";
export * from "./core";
export * from "./types";
export * from "./protocols";
export * from "./predicates";
export * from "./associatives";
export * from "./signals";
export * from "./multimethods";
export * from "./benchmarks"; //TODO remove in final
export * from "./dom";

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
export const conj = ICollection.conj;
export const toObject = IObj.toObject;
export const reset = IReset.reset;
export const on = IEvented.on;
export const off = IEvented.off;
export const find = IFind.find;
export const invoke = IFn.invoke;
export const parent = IHierarchicalSet.parent;
export const children = IHierarchicalSet.children;
export const nextSibling = IHierarchicalSet.nextSibling;
export const prevSibling = IHierarchicalSet.prevSibling;
export const compare = IComparable.compare;
export const toArray = IArr.toArray;
export const assoc = IAssociative.assoc;
export const contains = IAssociative.contains;
export const append = overload(null, identity, IAppendable.append, reducing(IAppendable.append));
export const prepend = overload(null, identity, IPrependable.prepend, reducing(IPrependable.prepend));
export const step = ISteppable.step;
export const converse = ISteppable.converse;
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

export function contents2(self, type){
  return T.filter(function(node){
    return node.nodeType === type;
  }, IContent.contents(self))
}

export const contents = overload(null, IContent.contents, contents2);

export function subset(subset, superset){
  return ISet.superset(superset, subset);
}

function reduce2(xf, coll){
  return IReduce.reduce(coll, xf, xf());
}

function reduce3(xf, init, coll){
  return IReduce.reduce(coll, xf, init);
}

export const reduce = overload(null, null, reduce2, reduce3);

export function reducekv2(xf, coll){
  return IKVReduce.reducekv(coll, xf, xf());
}

export function reducekv3(xf, init, coll){
  return IKVReduce.reducekv(coll, xf, init);
}

export const reducekv = overload(null, null, reducekv2, reducekv3);

export function proceed1(self){
  return ISteppable.step(IUnit.unit(self), self);
}

export function proceed2(self, amount){
  return ISteppable.step(IUnit.unit(self, amount), self);
}

export const proceed = overload(null, proceed1, proceed2);

export function recede1(self){
  return ISteppable.step(ISteppable.converse(IUnit.unit(self)), self);
}

export function recede2(self, amount){
  return ISteppable.step(ISteppable.converse(IUnit.unit(self, amount)), self);
}

export const recede = overload(null, recede1, recede2);

function swap3(self, f, a){
  return ISwap.swap(self, function(state){
    return f(state, a);
  });
}

function swap4(self, f, a, b){
  return ISwap.swap(self, function(state){
    return f(state, a , b);
  });
}

function swapN(self, f, a, b, cs){
  return ISwap.swap(self, function(state){
    return f.apply(null, [state, a , b, ...cs]);
  });
}

export const swap = overload(null, null, ISwap.swap, swap3, swap4, swapN);

function dissocN(obj, ...keys){
  return IReduce.reduce(keys, IMap.dissoc, obj);
}

export const dissoc = overload(null, identity, IMap.dissoc, dissocN);

export const appendTo  = T.realized(T.reversed(IAppendable.append));
export const prependTo = T.realized(T.reversed(IPrependable.prepend));

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
