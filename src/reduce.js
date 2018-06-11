import {overload} from "./core";
import {IReduce} from "./protocols/ireduce";

function reduce2(xf, coll){
  return IReduce.reduce(coll, xf, xf());
}

function reduce3(xf, init, coll){
  return IReduce.reduce(coll, xf, init);
}

export const reduce = overload(null, null, reduce2, reduce3);
