import * as _ from "atomic/core";
import {OrderedSet} from "immutable";
export {OrderedSet} from "immutable";

export function orderedSet(coll){
  return _.reduce(function(memo, value){
    return memo.add(value);
  }, new OrderedSet(), coll || []);;
}

export function emptyOrderedSet(){
  return new OrderedSet();
}
