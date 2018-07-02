import {overload, identity} from "../../core";
import IMap from "./instance";
import {IReduce} from "../ireduce";

export const keys = IMap.keys;
export const vals = IMap.vals;

function dissocN(obj, ...keys){
  return IReduce.reduce(keys, IMap.dissoc, obj);
}

export const dissoc = overload(null, identity, IMap.dissoc, dissocN);