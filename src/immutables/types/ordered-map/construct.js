import * as _ from "atomic/core";
import {OrderedMap} from "immutable";
export {OrderedMap} from "immutable";

export function orderedMap(obj){
  return _.ako(obj, OrderedMap) ? obj : _.reduce(function(memo, [key, value]){
    return memo.set(key, value);
  }, new OrderedMap(), obj);
}
