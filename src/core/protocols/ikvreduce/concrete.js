import {overload} from "../../core.js";
import {IKVReduce} from "./instance.js";

export function reducekv2(f, coll){
  return IKVReduce.reducekv(coll, f, f());
}

export function reducekv3(f, init, coll){
  return IKVReduce.reducekv(coll, f, init);
}

export const reducekv = overload(null, null, reducekv2, reducekv3);
