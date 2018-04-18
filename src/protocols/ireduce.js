import {protocol} from '../protocol';
import {overload} from "../core";
export const IReduce = protocol({_reduce: null});

function reduce2(xf, coll){
  return IReduce._reduce(coll, xf, xf());
}

function reduce3(xf, init, coll){
  return IReduce._reduce(coll, xf, init);
}

export const reduce = overload(null, null, reduce2, reduce3);

export default IReduce;