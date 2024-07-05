import {IAssociative} from "../../protocols/iassociative/instance.js";

export function PersistentMap(mapped, length){
  this.mapped = mapped;
  this.length = length;
}

export function persistentMap(xs = []){
  const entries = Array.from(xs);
  let map = new PersistentMap({}, 0);
  for(const [key, value] of entries){
    map = IAssociative.assoc(map, key, value);
  }
  return map;
}
