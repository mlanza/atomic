import {overload} from "../../core";
import * as p from "../iswap";

function swap3(self, f, a){
  return p.swap(self, function(state){
    return f(state, a);
  });
}

function swap4(self, f, a, b){
  return p.swap(self, function(state){
    return f(state, a , b);
  });
}

function swapN(self, f, a, b, cs){
  return p.swap(self, function(state){
    return f.apply(null, [state, a , b, ...cs]);
  });
}

export const swap = overload(null, null, p.swap, swap3, swap4, swapN);