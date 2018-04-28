import {protocol, satisfies} from "../protocol";
import {overload} from '../core';

export const ISwap = protocol({
  _swap: null
});

function swap3(self, f, a){
  return ISwap._swap(null, function(state){
    return f(state, a);
  });
}

function swap4(self, f, a, b){
  return ISwap._swap(null, function(state){
    return f(state, a , b);
  });
}

function swapN(self, f, a, b, cs){
  return ISwap._swap(null, function(state){
    return f.apply(null, [state, a , b].concat(cs));
  });
}

export const swap = overload(null, null, ISwap._swap, swap3, swap4, swapN);
export const isSwap = satisfies(ISwap);
export default ISwap;