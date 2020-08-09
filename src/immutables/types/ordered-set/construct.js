import {OrderedSet} from "immutable";
import {ICoerceable} from "atomic/core";
export {OrderedSet} from "immutable";

export function orderedSet(coll){
  return coll instanceof OrderedSet ? coll : new OrderedSet(ICoerceable.toArray(coll));
}

export function emptyOrderedSet(){
  return new OrderedSet();
}