import * as p from "./protocols";
import * as T from "./types";
import * as t from "./transducers";

export const transducers = {
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
export const second = T.comp(p.first, p.next);

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