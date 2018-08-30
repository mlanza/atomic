import Immutable from "immutable";
import {IArray} from "../../protocols/iarray";

export const Set = Immutable.Set;

export function set(coll){
  return coll instanceof Set ? coll : new Set(IArray.toArray(coll));
}

export function emptySet(){
  return new Set();
}

export default Set;