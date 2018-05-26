import {overload} from "../../core";
import * as p from "../ikvreduce";

export function reducekv2(xf, coll){
  return p.reducekv(coll, xf, xf());
}

export function reducekv3(xf, init, coll){
  return p.reducekv(coll, xf, init);
}

export const reducekv = overload(null, null, reducekv2, reducekv3);