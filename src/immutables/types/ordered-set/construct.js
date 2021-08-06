import * as _ from "atomic/core";
import {OrderedSet} from "immutable";
export {OrderedSet} from "immutable";

export function orderedSet(coll){
  return _.ako(coll, OrderedSet) ? coll : new OrderedSet(_.toArray(coll));
}

export function emptyOrderedSet(){
  return new OrderedSet();
}
