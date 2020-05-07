import {constructs, overload, identity, emptyObject, selectKeys as whitelist, reducekv, assoc, includes} from "atomic/core";
import {_ as v} from "param.macro";

export function URL(url, xfq){
  this.url = url;
  this.xfq = xfq;
}

URL.prototype.toString = function(){
  return this.url;
}

function url1(url){
  return url2(url, identity);
}

const url2 = constructs(URL);

export const url = overload(null, url1, url2);

function blacklist(obj, keys){
  return reducekv(function(memo, key, value){
    return includes(keys, key) ? memo : assoc(memo, key, value);
  }, {}, obj);
}

export function restrictedUrl(url, options){
  const list = options.whitelist || options.blacklist,
        f    = options.whitelist ? whitelist : blacklist;
  return url2(url, f(v, list));
}

export function fixedUrl(url){
  return url2(url, emptyObject);
}