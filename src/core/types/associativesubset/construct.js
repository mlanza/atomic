import {ISeqable} from "../../protocols/iseqable";
import Object from '../../types/object/construct';

export function AssociativeSubset(obj, keys){
  this.obj = obj;
  this.keys = keys;
}

AssociativeSubset.EMPTY = Object.EMPTY;

export function associativeSubset(obj, keys){
  return ISeqable.seq(keys) ? new AssociativeSubset(obj, keys) : AssociativeSubset.EMPTY;
}

export default AssociativeSubset;

export function isAssociativeSubset(self){
  return self.constructor === AssociativeSubset;
}