import {overload, identity, invokes} from "./core/core";
import {pipeline} from "./core/types/pipeline/construct";
import {append} from "./core/protocols/iappendable/concrete";
import {prepend} from "./core/protocols/iprependable/concrete";
import {getIn, get} from "./core/protocols/ilookup/concrete";
import {absorb} from "./core/associatives";
import {assoc, update, assocIn} from "./core/protocols/iassociative/concrete";
import {dissoc} from "./core/protocols/imap/concrete";
import {before, after} from "./core/protocols/iinsertable/concrete";
import {count} from "./core/protocols/icounted/concrete";
import {fill} from "./core/protocols/itemplate/concrete";
import {reducekv} from "./core/protocols/ikvreduce/concrete";
import {reduce} from "./core/protocols/ireduce/concrete";
import {fork} from "./core/predicates";
import {mapa, take, mapIndexed} from "./core/types/lazy-seq/concrete";
import {emptyObject} from "./core/types/object/construct";
import {reject, resolve} from "./core/types/promise";
import {comp, see} from "./core/types/function/concrete";
import fetch from "fetch";
import {_ as v} from "param.macro";

const checkStatus = fork(get(v, "ok"), resolve, reject);

export function request(req){
  return fetch(req.url, req).then(checkStatus);
}

export function headers(value){
  return update(v, "headers", function(was){
    return absorb(was || {}, value);
  });
}

export function config(options){
  options = absorb({
    defaults: {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose"
      }
    },
    paramKeys: [],
  }, options || {});
  return pipeline([request]) |>
    before(v, request, absorb(options.defaults, v)) |>
    before(v, request, asQueryParams(options.paramKeys)) |>
    before(v, request, acceptQueryParams) |>
    before(v, request, loadUrl);
}

export function url(self, template, options){
  options = absorb({
    require: [],
    read: invokes(v,"json"),
    extract: getIn(v, ["d", "results"])
  }, options || {});
  return self |>
    prepend(v, assoc(v, "url", template)) |>
    prepend(v, comp(resolve, contract(options.require))) |>
    append(v, options.read) |>
    append(v, options.extract);
}

function loadUrl(options){
  return update(options, "url", fill(v, options));
}

export function acceptQueryParams(options){
  return update(options, "url", function(url){
    const qs = mapa(function([key, value]){
      return key + "=" + value.toString();
    }, options.params || {}).join("&");
    return qs ? url + "?" + qs : url;
  });
}

export function contract(keys){
  const cnt = count(keys);
  return cnt ? function(...vals){
    return reducekv(function(memo, idx, value){
      return assoc(memo, get(keys, idx), value);
    }, get(vals, cnt, {}), mapIndexed(function(idx, value){
      return [idx, value];
    }, take(cnt, vals)));
  } : identity;
}

export function asQueryParams(keys){
  return function(options){
    return reduce(function(memo, key){
      const value = get(memo, key);
      return value == null ? memo : update(dissoc(memo, key), "params", function(params){
        return assoc(params, key, value);
      });
    }, options, keys);
  }
}