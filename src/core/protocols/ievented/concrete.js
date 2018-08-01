import {effect, overload} from "../../core";
import {apply} from "../../types/function/concrete";
import {compact, each} from "../../types/lazy-seq/concrete";
import {count} from "../../protocols/icounted/concrete";
import IEvented from "./instance";

export const off = IEvented.off;
export const trigger = IEvented.trigger;

export function on(self, key, ...args){
  each(function(key){
    apply(IEvented.on, self, key, args)
  }, compact(key.split(" ")));
}

function one3(self, key, callback){
  const cb = effect(callback, function(){
    off(self, key, cb);
  });
  on(self, key, cb);
}

function one4(self, key, selector, callback){
  const cb = effect(callback, function(){
    off(self, key, cb);
  });
  on(self, key, selector, cb);
}

export const one = overload(null, null, null, one3, one4);