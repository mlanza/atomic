import {List} from "immutable";
export {List} from "immutable";

export function list(obj){
  return obj instanceof List ? obj : new List(obj);
}