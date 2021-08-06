import * as _ from "atomic/core";
import {Map} from "immutable";

export function map(obj){
  return _.ako(obj, Map) ? obj : new Map(obj);
}
