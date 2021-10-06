import * as p from "./protocols.js";
import Symbol from "symbol";

export function AssociativeSubset(obj, keys){
  this.obj = obj;
  this.keys = keys;
}

AssociativeSubset.prototype[Symbol.toStringTag] = "AssociativeSubset";

export function associativeSubset(obj, keys){
  return p.seq(keys) ? new AssociativeSubset(obj, keys) : {};
}
