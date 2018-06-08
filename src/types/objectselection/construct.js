import {ISeqable} from "../../protocols/iseqable";
import EmptyList from "../emptylist";

export function ObjectSelection(obj, keys){
  this.obj = obj;
  this.keys = keys;
}

export function objectSelection(obj, keys){
  return new ObjectSelection(obj, ISeqable.seq(keys) ? keys : EmptyList.EMPTY);
}

export default ObjectSelection;

export function isObjectSelection(self){
  return self.constructor === ObjectSelection;
}