import * as T from "./types.js";
import * as _ from "atomic/core";
export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
import {IParams} from "./protocols.js";

export function text(req){
  return _.fmap(req, function(resp){
    return resp.text();
  });
}

export function xml(req){
  const parser = new DOMParser();
  return _.fmap(text(req), function(text){
    return parser.parseFromString(text, "text/xml");
  });
}

export function raise(req){
  return _.fmap(req, function(resp){
    return new Promise(function(resolve, reject){
      return resp.ok ? resolve(resp) : reject(resp);
    });
  });
}

export function suppress(req, f){
  return _.fmap(req, function(resp){
    return new Promise(function(resolve, reject){
      return resp.ok ? resolve(resp) : resolve(f(resp));
    });
  });
}

function params(self, obj){
  const f = _.isFunction(obj) ? obj : _.merge(?, obj);
  return _.str(
    self |> _.split(?, "?") |> _.first,
    self |> _.fromQueryString |> f |> _.toQueryString);
}

_.implement(IParams, {params}, String);

_.ICoercible.addMethod([T.Request, Promise], _.unfork);
_.ICoercible.addMethod([T.Routed, Promise], _.unfork);
