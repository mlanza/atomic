import * as _ from "atomic/core";
import {List} from "immutable";
export {List} from "immutable";

export function list(obj){
  return _.ako(obj, List) ? obj : new List(obj);
}
