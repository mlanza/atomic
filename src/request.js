import {overload, constantly, identity, invokes, partial} from "./core/core";
import {pipeline} from "./core/types/pipeline/construct";
import {satisfies} from "./core/types/protocol/concrete";
import {append} from "./core/protocols/iappendable/concrete";
import {prepend} from "./core/protocols/iprependable/concrete";
import {getIn, get} from "./core/protocols/ilookup/concrete";
import {absorb} from "./core/associatives";
import {assoc, update, assocIn, contains} from "./core/protocols/iassociative/concrete";
import {dissoc} from "./core/protocols/imap/concrete";
import {before, after} from "./core/protocols/iinsertable/concrete";
import {count} from "./core/protocols/icounted/concrete";
import {fill} from "./core/protocols/itemplate/concrete";
import {first} from "./core/protocols/iseq/concrete";
import {reducekv} from "./core/protocols/ikvreduce/concrete";
import {reduce} from "./core/protocols/ireduce/concrete";
import {keys} from "./core/protocols/imap/concrete";
import {includes} from "./core/protocols/iinclusive/concrete";
import {fork, either} from "./core/predicates";
import {filter, mapa, map, every, compact, detect, dropWhile, takeWhile} from "./core/types/lazy-seq/concrete";
import {emptyObject} from "./core/types/object/construct";
import {reject, resolve} from "./core/types/promise";
import {not} from "./core/types/boolean";
import {apply, comp} from "./core/types/function/concrete";
import fetch from "fetch";
import {IDescriptive} from "./core/protocols/idescriptive/instance";
import {ISequential} from "./core/protocols/isequential/instance";
import {_ as v} from "param.macro";

function matches(re, pos, text){
  var match, results = [];
  while(match = re.exec(text)){
    results.push(match[pos]);
  }
  return results;
}

export function many(data){
  const xs = getIn(data, ["d", "results"]) || getIn(data, ["d"]);
  return satisfies(ISequential, xs) ? xs : [xs];
}

const isNotDescriptive = comp(not, satisfies(IDescriptive));
const wants = partial(matches, /\{([a-z]+)\}/gi, 1);

export const checkStatus = fork(get(v, "ok"), resolve, reject);
export const json = invokes(v, "json");
export const one = comp(first, many);

export function request(options){
  return fetch(options.url, options.options).
    then(apply(comp, compact([options.extract, options.read, options.status])));
}

export function headers(value){
  return update(v, "headers", function(was){
    return absorb(was || {}, value);
  });
}

function config1(options){
  options = absorb({
    options: {
      method: "GET",
    },
    status: checkStatus,
    read: json,
    extract: many,
    isParam: constantly(false)
  }, options || {});
  return pipeline([request]) |>
    before(v, request, comp(absorb(v, options), either(v, {}))) |>
    before(v, request, loadUrl);
}

function config2(self, settings){
  return before(self, loadUrl, absorb(v, settings));
}

export const config = overload(null, config1, config2);

export function defaults(self, context){
  return before(self, loadUrl, absorb({context}, v));
}

export function given(self, args){
  return prepend(self, comp(resolve, function(context){
    return {context};
  }, positional(args)));
}

export function firstGiven(self, args){
  return self |>
    given(v, args) |>
    returns(v, one);
}

export function returns(self, extract){
  return before(self, request, assoc(v, "extract", extract));
}

export function url(self, templates){
  return before(self, loadUrl, selectUrl(templates));
}

export function loadUrl(options){
  return options |>
    addQueryString |>
    update(v, "url", fill(v, options.context));
}

function selectUrl(templates){
  return function(options){
    const url = count(templates) === 1 ? first(templates) : detect(function(template){
      return every(contains(options.context, v), wants(template));
    }, templates);
    return assoc(options, "url", url);
  }
}

function addQueryString(options){
  const context = get(options, "context");
  const qs = mapa(function(key){
    const value = get(context, key);
    return key + "=" + value.toString();
  }, filter(options.isParam, keys(context))).join("&");
  return update(options, "url", function(url){
    const prefix = includes(url, "?") ? "&" : "?";
    return qs ? url + prefix + qs : url;
  });
}

function positional(keys){
  return function(...vals){
    const xs = takeWhile(isNotDescriptive, vals),
          x  = first(dropWhile(isNotDescriptive, vals)) || {};
    return reducekv(assoc, x, map(function(key, value){
      return [key, value];
    }, keys, xs));
  }
}