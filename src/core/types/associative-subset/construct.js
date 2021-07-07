import * as p from "./protocols.js";

export function AssociativeSubset(obj, keys){
  this.obj = obj;
  this.keys = keys;
}

export function associativeSubset(obj, keys){
  return p.seq(keys) ? new AssociativeSubset(obj, keys) : {};
}

export function isAssociativeSubset(self){
  return self.constructor === AssociativeSubset;
}
