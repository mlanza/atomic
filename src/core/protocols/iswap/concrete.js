import {overload} from "../../core.js";
import {ISwap} from "./instance.js";

function swap3(self, f, a){
  return ISwap.swap(self, function(state){
    return f(state, a);
  });
}

function swap4(self, f, a, b){
  return ISwap.swap(self, function(state){
    return f(state, a , b);
  });
}

function swapN(self, f, a, b, cs){
  return ISwap.swap(self, function(state){
    return f.apply(null, [state, a , b, ...cs]);
  });
}

export const swap = overload(null, null, ISwap.swap, swap3, swap4, swapN);
