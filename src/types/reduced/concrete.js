import {overload} from "../../core";
import Reduced from "./construct";

export function unreduced(self){
  return self instanceof Reduced ? self.valueOf() : self;
}

function reduce3(xs, xf, init){
  var memo = init, to = xs.length - 1;
  for(var i = 0; i <= to; i++){
    if (memo instanceof Reduced)
      break;
    memo = xf(memo, xs[i]);
  }
  return unreduced(memo);
}

function reduce4(xs, xf, init, from){
  return reduce5(xs, xf, init, from, xs.length - 1);
}

function reduce5(xs, xf, init, from, to){
  var memo = init;
  if (from <= to) {
    for(var i = from; i <= to; i++){
      if (memo instanceof Reduced)
        break;
      memo = xf(memo, xs[i]);
    }
  } else {
    for(var i = from; i >= to; i--){
      if (memo instanceof Reduced)
        break;
      memo = xf(memo, xs[i]);
    }
  }
  return unreduced(memo);
}

export const reduce = overload(null, null, null, reduce3, reduce4, reduce5);

export function reducekv(xs, xf, init, from){
  var memo = init, len = xs.length;
  for(var i = from || 0; i < len; i++){
    if (memo instanceof Reduced)
      break;
    memo = xf(memo, i, xs[i]);
  }
  return unreduced(memo);
}

export function reducing(rf){
  return function(init, ...xs){
    return reduce3(xs, rf, init);
  }
}