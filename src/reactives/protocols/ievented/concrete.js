import * as _ from "atomic/core";
import {IEvented} from "./instance.js";

export const on = IEvented.on;
export const off = IEvented.off;
export const trigger = IEvented.trigger;

function one3(self, key, callback){
  function cb(e){
    off(self, key, ctx.cb);
    callback.call(this, e);
  }
  const ctx = {cb: cb};
  return on(self, key, cb);
}

function one4(self, key, selector, callback){
  function cb(e){
    off(self, key, ctx.cb);
    callback.call(this, e);
  }
  const ctx = {cb: cb};
  return on(self, key, selector, cb);
}

export const one = _.overload(null, null, null, one3, one4);
