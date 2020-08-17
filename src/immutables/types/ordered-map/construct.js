import {OrderedMap} from "immutable";
export {OrderedMap} from "immutable";

export function orderedMap(obj){
  return obj instanceof OrderedMap ? obj : new OrderedMap(obj);
}