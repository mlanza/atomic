import {does, overload} from "../../core";
import {apply} from "../../types/function/concrete";
import {isString} from "../../types/string/construct";
import {compact} from "../../types/lazy-seq/concrete";
import {count} from "../../protocols/icounted/concrete";
import {reduce} from "../../protocols/ireduce/concrete";
import IEvented from "./instance";

export const off = IEvented.off;
export const trigger = IEvented.trigger;

export function on(self, key, ...args){
  return isString(key) ? reduce(function(self, key){  //TODO move string key/split to element
    return apply(IEvented.on, self, key, args);
  }, self, compact(key.split(" "))) : IEvented.on(self, key, ...args);
}

function one3(self, key, callback){
  const cb = does(callback, function(){
    off(self, key, cb);
  });
  return on(self, key, cb);
}

function one4(self, key, selector, callback){
  const cb = does(callback, function(){
    off(self, key, cb);
  });
  return on(self, key, selector, cb);
}

export const one = overload(null, null, null, one3, one4);