import {satisfies} from "./core/types/protocol/concrete";
import {getIn, get} from "./core/protocols/ilookup/concrete";
import {absorb} from "./core/associatives";
import {dissoc} from "./core/protocols/imap/concrete";
import {fmap} from "./core/protocols/ifunctor/concrete";
import {count} from "./core/protocols/icounted/concrete";
import {fill} from "./core/protocols/itemplate/concrete";
import {first} from "./core/protocols/iseq/concrete";
import {reducekv} from "./core/protocols/ikvreduce/concrete";
import {keys} from "./core/protocols/imap/concrete";
import {includes} from "./core/protocols/iinclusive/concrete";
import {assoc, update, assocIn, contains} from "./core/protocols/iassociative/concrete";
import {filter, mapa, map, every, detect, dropWhile, takeWhile} from "./core/types/lazy-seq/concrete";
import {emptyObject} from "./core/types/object/construct";
import {not} from "./core/types/boolean";
import {reSeq} from "./core/types/reg-exp/concrete";
import {comp} from "./core/types/function/concrete";
import {IDescriptive} from "./core/protocols/idescriptive/instance";
import {fork} from "./core/protocols/ifork/concrete";
import Task, {task} from "./core/types/task";
import fetch from "fetch";
import {_ as v} from "param.macro";

const wants = reSeq(/\{([a-z0-9]+)\}/gi, v);
const isNotDescriptive = comp(not, satisfies(IDescriptive));

export function url(url){
  return fmap(v, function(options){
    return absorb({url}, options);
  });
}

export function method(method){
  return fmap(v, function(options){
    return absorb({method}, options);
  });
}

export function credentials(credentials){
  return fmap(v, function(options){
    return absorb({credentials}, options);
  });
}

export function headers(headers){
  return fmap(v, function(options){
    return absorb({headers}, options);
  });
}

export function context(context){
  return fmap(v, function(options){
    return absorb({context}, options);
  });
}

export function request(options){
  return task(function(reject, resolve){
    fork(fetch(options.url, options), reject, resolve);
  });
}

export function check(resp){
  return task(function(reject, resolve){
    return resp.ok ? resolve(resp) : reject(resp);
  });
}

export function json(resp){
  return task(function(reject, resolve){
    fork(resp.json(), reject, resolve);
  });
}

export function addQueryString(pred){
  return function(options){
    const qs = mapa(function(key){
      const value = get(options.context, key).toString();
      return `${key}=${value}`;
    }, filter(pred, keys(options.context))).join("&");
    return update(options, "url", function(url){
      const prefix = includes(url, "?") ? "&" : "?";
      return qs ? url + prefix + qs : url;
    });
  }
}

export function selectUrl(templates){
  return function(options){
    const url = count(templates) === 1 ? first(templates) : detect(function(template){
      return every(contains(options.context, v),
        map(get(v, 1), wants(template)));
    }, templates);
    return assoc(options, "url", url);
  }
}

export function loadUrl(options){
  return update(options, "url", fill(v, options.context));
}

export function mandatory(keys){
  return function(...vals){
    const xs = takeWhile(isNotDescriptive, vals),
          x  = first(dropWhile(isNotDescriptive, vals)) || {};
    return reducekv(assoc, x, map(function(key, value){
      return [key, value];
    }, keys, xs));
  }
}

export function requests(keys){
  return comp(Task.of, assoc({}, "context", v), mandatory(keys));
}