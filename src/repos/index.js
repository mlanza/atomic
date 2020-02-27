import Promise from "promise";
import * as _ from "atomic/core";
export * from "./types";
export * from "./protocols";
export * from "./protocols/concrete";

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
  })
}