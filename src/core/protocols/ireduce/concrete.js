import {overload, identity} from "../../core.js";
import {IReduce} from "./instance.js";

function reduce2(xf, coll){
  return IReduce.reduce(coll, xf, xf());
}

function reduce3(xf, init, coll){
  return IReduce.reduce(coll, xf, init);
}

export const reduce = overload(null, null, reduce2, reduce3);

function reducing1(rf){
  return reducing2(rf, identity);
}

function reducing2(rf, order){
  return function(x, ...xs){
    return IReduce.reduce(order(xs), rf, x);
  }
}

export const reducing = overload(null, reducing1, reducing2);