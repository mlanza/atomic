import * as _ from "atomic/core";
import {OrderedMap} from "immutable";
export {OrderedMap} from "immutable";

export function orderedMap(obj){
  return _.ako(obj, OrderedMap) ? obj : new OrderedMap(obj);
}
