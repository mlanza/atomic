import {Set} from "immutable";
import {ICoerceable} from "atomic/core";
export {Set} from "immutable";

export function set(coll){
  return coll instanceof Set ? coll : new Set(ICoerceable.toArray(coll));
}

export function emptySet(){
  return new Set();
}