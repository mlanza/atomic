import {comp, cons, str, reducing, EMPTY, lazySeq, concat, set} from "./types";
import {overload, identity, constantly} from "./core";
import * as pl from "./pipelines";
import * as p  from "./protocols";
import * as a from "./associatives";
import * as t from "./transducers";
import * as s from "./sequences";
export * from "./core";
export * from "./protocols";
export * from "./types";
export * from "./predicates";
export * from "./sequences";
export * from "./associatives";
export * from "./pipelines";
export * from "./signals";
export * from "./dom";

export const map = overload(null, t.map, s.map);
export const mapcat = overload(null, t.mapcat, s.mapcat);
export const mapIndexed = overload(null, t.mapIndexed, s.mapIndexed);
export const filter = overload(null, t.filter, s.filter);
export const remove = overload(null, t.remove, s.remove);
export const detect = overload(null, t.detect, s.detect);
export const compact = overload(t.compact, s.compact);
export const dedupe = overload(t.dedupe, s.dedupe);
export const take = overload(null, t.take, s.take);
export const drop = overload(null, t.drop, s.drop);
export const interpose = overload(null, t.interpose, s.interpose);
export const dropWhile = overload(null, t.dropWhile, s.dropWhile);
export const keep = overload(null, t.keep, s.keep);
export const keepIndexed = overload(null, t.keepIndexed, s.keepIndexed);
export const takeWhile = overload(null, t.takeWhile, s.takeWhile);
export const takeNth = overload(null, t.takeNth, s.takeNth);
export const distinct = overload(t.distinct, s.distinct);

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
    return f.apply(null, [state, a , b].concat(cs));
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
