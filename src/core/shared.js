import {isReduced, reduced, unreduced} from "./types/reduced.js";
import {first, next} from "./protocols/iseq/concrete.js"
import {seq} from "./protocols/iseqable/concrete.js";

export function reduce(xs, f, init){
  let memo = init,
      ys = seq(xs);
  while(ys && !isReduced(memo)){
    memo = f(memo, first(ys));
    ys = next(ys);
  }
  return unreduced(memo);
}

export function reducekv(xs, f, init){
  let memo = init,
      ys = seq(xs),
      idx = 0;
  while (ys && !isReduced(memo)){
    memo = f(memo, idx++, first(ys));
    ys = next(ys);
  }
  return unreduced(memo);
}

