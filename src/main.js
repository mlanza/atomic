import {overload, identity, counter} from "./core";
import {reducing} from "./types/reduced";
import {sort} from "./types/lazyseq";
import {chain} from "./types/pipeline";
import {IAppendable, IHash, IArray, IAssociative, IBounds, IConverse, ICloneable, ICollection, IComparable, IContent, ICounted, IDecode, IDeref, IDisposable, IEmptyableCollection, IEncode, IEquiv, IEvented, IFind, IFn, IHierarchy, IInclusive, IIndexed, IKVReduce, ILookup, IMap, IMapEntry, INext, IObject, IPrependable, IPublish, IReduce, IReset, IReversible, ISeq, ISeqable, ISet, IShow, ISteppable, ISubscribe, ISwap, IUnit} from "./protocols";
import {Array, Concatenated, Date, Range, Period, When, Duration, Months, Years, List, EmptyList} from "./types";

import * as T from "./types";
import * as d from "./dom";

export * from "./clojure";
export * from "./core";
export * from "./types";
export * from "./protocols";
export * from "./predicates";
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
export const assoc = IAssociative.assoc;
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

export const appendTo  = T.realized(T.flip(IAppendable.append));
export const prependTo = T.realized(T.flip(IPrependable.prepend));

const encodedRefs   = new WeakMap()
const encodedRefIds = counter();
const constructors  = { //reference types only
  Range: Range.from,
  Period: Period.from,
  When: When.from,
  Months: Months.from,
  Years: Years.from,
  Date: Date.from,
  Duration: Duration.from,
  List: List.from,
  EmptyList: EmptyList.from,
  Concatenated: Concatenated.from
}

function encode1(self){
  return encode2(self, "@type");
}

function encode2(self, label){
  return IEncode.encode(self, label, encodedRefs, encodedRefIds);
}

export const encode = overload(null, encode1, encode2, IEncode.encode);

function decode1(self){
  return decode2(self, "@type");
}

function decode2(self, label){
  return IDecode.decode(self, label, constructors);
}

export const decode = overload(null, decode1, decode2);

export function serialize(self){
  return JSON.stringify(encode(self));
}

export function deserialize(text){
  return decode(JSON.parse(text));
}

function hash1(self){
  return hash2(self, "@type");
}

function hash2(self, label){
  return IHash.hash(self, label, encodedRefs, encodedRefIds);
}

export const hash = overload(null, hash1, hash2, IHash.hash);

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
