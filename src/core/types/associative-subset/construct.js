import {ISeqable} from "../../protocols/iseqable";

export function AssociativeSubset(obj, keys){
  this.obj = obj;
  this.keys = keys;
}

export function associativeSubset(obj, keys){
  return ISeqable.seq(keys) ? new AssociativeSubset(obj, keys) : {};
}

export default AssociativeSubset;

export function isAssociativeSubset(self){
  return self.constructor === AssociativeSubset;
}