import {comp} from "./types";
import {overload, identity, constantly} from "./core";
import * as p from "./protocols";
import * as a from "./associatives";
import * as t from "./transducers";
import * as types from "./types";

export * from "./core";
export * from "./types";
export * from "./protocols";
export * from "./protocols/ireduce/api";
export * from "./protocols/ikvreduce/api";
export * from "./protocols/imap/api";
export * from "./protocols/isteppable/api";
export * from "./protocols/iset/api";
export * from "./protocols/iswap/api";
export * from "./multimethods";
export * from "./predicates";
export * from "./associatives";
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
export const second = comp(p.first, p.next);

//e.g. counter: generate(iterate(inc, 0)) or partial(generate, iterate(inc, 0))) for a counter factory;
export function generate(iterable){
  let iter = iterable[Symbol.iterator]();
  return function(){
    return iter.done ? null : iter.next().value;
  }
}