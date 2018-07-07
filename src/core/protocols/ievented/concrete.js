import {effect, overload} from "../../core";
import IEvented from "./instance";

export const on = IEvented.on;
export const off = IEvented.off;
export const trigger = IEvented.trigger;

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