import {first, rest, toArray} from "./protocols/iseq";
import {seq} from "./protocols/iseqable";
import {show} from "./protocols/ishow";
import {next} from "./protocols/inext";

export function nextSeq(self){
  return seq(rest(self));
}

export function showSeq(self){
  var xs = toArray(seq(self));
  return "[" + xs.map(function(x){
    return show(x);
  }).join(", ") + "]";
}

export function nthSeq(coll, idx, notFound){
  var xs = seq(coll);
  while(xs && idx > 0){
    xs = rest(xs);
    idx--;
  }
  return first(xs) || notFound || null;
}

export function nthIndexed(coll, idx, notFound){
  return coll[idx] || notFound || null;
}

function toArray2(xs, zs){
  var ys = zs || [];
  if (seq(xs) != null) {
    ys.push(first(xs));
    return toArray2(rest(xs), ys);
  }
  return ys;
}

export function toArraySeq(xs){
  return toArray2(xs)
}

export function reduceSeq(xs, xf, init, from){
  var memo = init,
      ys = seq(xs);
  while(ys && !(memo instanceof Reduced)){
    memo = xf(memo, first(ys));
    ys = next(ys);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}