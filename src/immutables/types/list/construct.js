import * as _ from "atomic/core";
import {List} from "immutable";
export {List} from "immutable";

export function list(obj){
  return _.ako(coll, List) ? coll :_.reduce(function(memo, value){
    return memo.add(value);
  }, new List(), coll || []);
}
