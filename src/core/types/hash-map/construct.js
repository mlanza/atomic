import {IAssociative} from "../../protocols/iassociative/instance.js";
import {equiv} from "../../protocols/iequiv/concrete.js";

export function HashMap(mapped, length, equals){
  this.mapped = mapped;
  this.length = length;
  this.equals = equals;
}

export function hashMap(xs = [], equals = equiv){
  const entries = Array.from(xs);
  let map = new HashMap({}, 0, equals);
  for(const [key, value] of entries){
    map = IAssociative.assoc(map, key, value);
  }
  return map;
}
