import {overload, identity} from "../../core.js";
import {IMap} from "./instance.js";
import {reduce} from "../ireducible/concrete.js";

export const keys = IMap.keys;
export const vals = IMap.vals;

function dissocN(obj, ...keys){
  return reduce(IMap.dissoc, obj, keys);
}

export const dissoc = overload(null, identity, IMap.dissoc, dissocN);
