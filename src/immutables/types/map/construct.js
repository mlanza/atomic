import * as _ from "atomic/core";
import {Map} from "immutable";

export function map(obj){
  return _.ako(obj, Map) ? obj : _.reduce(function(memo, [key, value]){
    return memo.set(key, value);
  }, new Map(), obj);
}
