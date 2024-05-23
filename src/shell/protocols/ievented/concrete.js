import * as _ from "atomic/core";
import {IEvented} from "./instance.js";

export const on = IEvented.on;
export const chan = IEvented.chan;
export const trigger = IEvented.trigger;

function once3(self, key, callback){
  const off = on(self, key, function(e){
    off();
    callback.call(this, e);
  });
  return off;
}

function once4(self, key, selector, callback){
  const off = on(self, key, selector, function(e){
    off();
    callback.call(this, e);
  });
  return off;
}

export const once = _.overload(null, null, null, once3, once4);
