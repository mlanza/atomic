import {overload} from "../../core";
import IReduce from "./instance";

function reduce2(xf, coll){
  return IReduce.reduce(coll, xf, xf());
}

function reduce3(xf, init, coll){
  return IReduce.reduce(coll, xf, init);
}

export const reduce = overload(null, null, reduce2, reduce3);

export function reducing(rf){
  return function(x, ...xs){
    return IReduce.reduce(xs, rf, x);
  }
}