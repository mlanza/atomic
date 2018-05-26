import {overload, identity} from "../../core";
import * as p from "../../protocols";

function dissocN(obj, ...keys){
  return p.reduce(keys, p.dissoc, obj);
}

export const dissoc = overload(null, identity, p.dissoc, dissocN);