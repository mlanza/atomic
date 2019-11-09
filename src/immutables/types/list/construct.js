import Immutable from "immutable";

export const List = Immutable.List;

export function list(obj){
  return obj instanceof List ? obj : new List(obj);
}