import {Map} from "immutable";
export {Map} from "immutable";

export function map(obj){
  return obj instanceof Map ? obj : new Map(obj);
}