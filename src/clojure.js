import {apply, comp, cons, str, reducing, EMPTY, lazySeq, concat, concatenated, set} from "./types";
import {overload, identity, constantly} from "./core";
import * as pl from "./pipelines";
import * as p  from "./protocols";
import * as a  from "./associatives";
import * as t  from "./transducers";
import * as types from "./types";

export * from "./core";
export * from "./types";
export * from "./protocols";
export * from "./multimethods";
export * from "./predicates";
export * from "./associatives";
export * from "./pipelines";
export * from "./signals";
export * from "./dom";

export {add as embed, remove as unembed} from "./multimethods";

export const map = overload(null, t.map, types.map);
export const mapcat = overload(null, t.mapcat, types.mapcat);
export const mapIndexed = overload(null, t.mapIndexed, types.mapIndexed);
export const filter = overload(null, t.filter, types.filter);
export const remove = overload(null, t.remove, types.remove);
export const detect = overload(null, t.detect, types.detect);
export const compact = overload(t.compact, types.compact);
export const dedupe = overload(t.dedupe, types.dedupe);
export const take = overload(null, t.take, types.take);
export const drop = overload(null, t.drop, types.drop);
export const interpose = overload(null, t.interpose, types.interpose);
export const dropWhile = overload(null, t.dropWhile, types.dropWhile);
export const keep = overload(null, t.keep, types.keep);
export const keepIndexed = overload(null, t.keepIndexed, types.keepIndexed);
export const takeWhile = overload(null, t.takeWhile, types.takeWhile);
export const takeNth = overload(null, t.takeNth, types.takeNth);
export const distinct = overload(t.distinct, types.distinct);

function reduce2(xf, coll){
  return p.reduce(coll, xf, xf());
}

function reduce3(xf, init, coll){
  return p.reduce(coll, xf, init);
}

function dissocN(obj, ...keys){
  return p.reduce(keys, p.dissoc, obj);
}

export function reducekv2(xf, coll){
  return p.reducekv(coll, xf, xf());
}

export function reducekv3(xf, init, coll){
  return p.reducekv(coll, xf, init);
}

function swap3(self, f, a){
  return p.swap(self, function(state){
    return f(state, a);
  });
}

function swap4(self, f, a, b){
  return p.swap(self, function(state){
    return f(state, a , b);
  });
}

function swapN(self, f, a, b, cs){
  return p.swap(self, function(state){
    return f.apply(null, [state, a , b, ...cs]);
  });
}

export const swap = overload(null, null, p.swap, swap3, swap4, swapN);
export const reduce = overload(null, null, reduce2, reduce3);
export const reducekv = overload(null, null, reducekv2, reducekv3);
export const dissoc = overload(null, identity, p.dissoc, dissocN);
export const second = comp(p.first, p.next);

function join1(xs){
  return s.into("", s.map(str, xs));
}

function join2(sep, xs){
  return join1(s.interpose(sep, xs));
}

export const join = overload(null, join1, join2);
export const union = overload(set, identity, p.union, reducing(p.union));
export const intersection = overload(null, null, p.intersection, reducing(p.intersection));
export const difference = overload(null, null, p.difference, reducing(p.difference));
export function subset(subset, superset){
  return p.superset(superset, subset);
}

export function proceed1(self){
  return p.step(p.unit(self), self);
}

export function proceed2(self, amount){
  return p.step(p.unit(self, amount), self);
}

export const proceed = overload(null, proceed1, proceed2);

export function recede1(self){
  return p.step(p.converse(p.unit(self)), self);
}

export function recede2(self, amount){
  return p.step(p.converse(p.unit(self, amount)), self);
}

export const recede = overload(null, recede1, recede2);

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

//e.g. counter: generate(iterate(inc, 0)) or partial(generate, iterate(inc, 0))) for a counter factory;
export function generate(iterable){
  let iter = iterable[Symbol.iterator]();
  return function(){
    return iter.done ? null : iter.next().value;
  }
}