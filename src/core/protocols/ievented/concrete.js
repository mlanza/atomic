import {effect, overload} from "../../core";
import {apply} from "../../types/function/concrete";
import {compact, map} from "../../types/lazy-seq/concrete";
import {count} from "../../protocols/icounted/concrete";
import IEvented from "./instance";

export const off = IEvented.off;
export const trigger = IEvented.trigger;

export function on(self, key, ...args){
  const keys = compact(key.split(" "));
  if (count(keys) === 1) {
    return apply(IEvented.on, self, key, args);
  } else {
    return apply(effect, map(function(key){
      return apply(IEvented.on, self, key, args);
    }, keys));
  }
}

function one3(self, key, callback){
  const unsub = on(self, key, effect(callback, function(){
    unsub();
  }));
  return unsub;
}

function one4(self, key, selector, callback){
  const unsub = on(self, key, selector, effect(callback, function(){
    unsub();
  }));
  return unsub;
}

export const one = overload(null, null, null, one3, one4);