import {overload} from "../../core.js";
import {IKVReduce} from "./instance.js";

export function reducekv2(xf, coll){
  return IKVReduce.reducekv(coll, xf, xf());
}

export function reducekv3(xf, init, coll){
  return IKVReduce.reducekv(coll, xf, init);
}

export const reducekv = overload(null, null, reducekv2, reducekv3);