import {overload} from "cloe/core";
import IEvented from "./instance";

export const on = IEvented.on;
export const off = IEvented.off;
export const trigger = IEvented.trigger;

function one3(self, key, callback){
  return on(self, key, function cb(e){
    off(self, key, cb);
    callback.call(this, e);
  });
}

function one4(self, key, selector, callback){
  return on(self, key, selector, function cb(e){
    off(self, key, cb);
    callback.call(this, e);
  });
}

export const one = overload(null, null, null, one3, one4);