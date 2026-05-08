import {overload} from "../../core.js";
import {IKVReducible} from "./instance.js";

export function reducekv2(f, coll){
  return IKVReducible.reducekv(coll, f, f());
}

export function reducekv3(f, init, coll){
  return IKVReducible.reducekv(coll, f, init);
}

export const reducekv = overload(null, null, reducekv2, reducekv3);
