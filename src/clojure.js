import {overload, identity, constantly} from "./core";
import * as p from "./protocols";
import * as a from "./associatives";
import * as t from "./transducers";
import * as T from "./types";

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
export const map = overload(null, t.map, T.map);
export const mapcat = overload(null, t.mapcat, T.mapcat);
export const mapIndexed = overload(null, t.mapIndexed, T.mapIndexed);
export const filter = overload(null, t.filter, T.filter);
export const remove = overload(null, t.remove, T.remove);
export const detect = overload(null, t.detect, T.detect);
export const compact = overload(t.compact, T.compact);
export const dedupe = overload(t.dedupe, T.dedupe);
export const take = overload(null, t.take, T.take);
export const drop = overload(null, t.drop, T.drop);
export const interpose = overload(null, t.interpose, T.interpose);
export const dropWhile = overload(null, t.dropWhile, T.dropWhile);
export const keep = overload(null, t.keep, T.keep);
export const keepIndexed = overload(null, t.keepIndexed, T.keepIndexed);
export const takeWhile = overload(null, t.takeWhile, T.takeWhile);
export const takeNth = overload(null, t.takeNth, T.takeNth);
export const distinct = overload(t.distinct, T.distinct);
export const second = T.comp(p.first, p.next);

//e.g. counter: generate(iterate(inc, 0)) or partial(generate, iterate(inc, 0))) for a counter factory;
export function generate(iterable){
  let iter = iterable[Symbol.iterator]();
  return function(){
    return iter.done ? null : iter.next().value;
  }
}