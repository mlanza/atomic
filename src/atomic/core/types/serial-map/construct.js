import {reduce} from "../../protocols/ireducible/concrete.js";
import {assoc} from "../../protocols/iassociative/concrete.js";

export function SerialMap(index, serialize){
  this.serialize = serialize;
  this.index = index;
}

export function serialMap(entries = [], index = {}, serialize = JSON.stringify){
  return reduce(function(memo, [key, value]){
    return assoc(memo, key, value);
  }, new SerialMap(index, serialize), entries);
}

export const smap = serialMap;
