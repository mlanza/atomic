import Immutable from "immutable";
import {ICoerce} from "cloe/core";

export const Set = Immutable.Set;

export function set(coll){
  return coll instanceof Set ? coll : new Set(ICoerce.toArray(coll));
}

export function emptySet(){
  return new Set();
}

export default Set;