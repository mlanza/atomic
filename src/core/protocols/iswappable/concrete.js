import {overload} from "../../core.js";
import {ISwappable} from "./instance.js";

function swap3(self, f, a){
  return ISwappable.swap(self, function(state){
    return f(state, a);
  });
}

function swap4(self, f, a, b){
  return ISwappable.swap(self, function(state){
    return f(state, a , b);
  });
}

function swapN(self, f, a, b, cs){
  return ISwappable.swap(self, function(state){
    return f.apply(null, [state, a , b, ...cs]);
  });
}

export const swap = overload(null, null, ISwappable.swap, swap3, swap4, swapN);
