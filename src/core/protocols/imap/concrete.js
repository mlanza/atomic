import {overload, identity} from "../../core.js";
import {IMap} from "./instance.js";
import {IReduce} from "../ireduce.js";

export const keys = IMap.keys;
export const vals = IMap.vals;

function dissocN(obj, ...keys){
  return IReduce.reduce(keys, IMap.dissoc, obj);
}

export const dissoc = overload(null, identity, IMap.dissoc, dissocN);