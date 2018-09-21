import fetch from "fetch";
import {
  satisfies,
  get,
  absorb,
  fmap,
  count,
  fill,
  first,
  reducekv,
  keys,
  includes,
  assoc,
  update,
  contains,
  filter,
  mapa,
  map,
  every,
  dropWhile,
  takeWhile,
  not,
  reSeq,
  comp,
  IDescriptive,
  fork,
  locate,
  Task,
  task
} from "cloe/core";
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
    const url = count(templates) === 1 ? first(templates) : locate(templates, function(template){
      return every(contains(options.context, v),
        map(get(v, 1), wants(template)));
    });
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