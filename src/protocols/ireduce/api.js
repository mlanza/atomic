import {overload} from "../../core";
import * as p from "../ireduce";

function reduce2(xf, coll){
  return p.reduce(coll, xf, xf());
}

function reduce3(xf, init, coll){
  return p.reduce(coll, xf, init);
}

export const reduce = overload(null, null, reduce2, reduce3);