import {reduce} from "../../protocols/ireducible/concrete.js";
import {assoc} from "../../protocols/iassociative/concrete.js";
import {str} from "../../types/string/concrete.js";
import * as p from "../../protocols/concrete.js";

export function SerialSet(coll, serialize){
  this.serialize = serialize;
  this.coll = coll;
}

export function serialSet(entries = [], serialize = JSON.stringify){
  return p.conj(new SerialSet({}, serialize), ...Array.from(entries));
}

export const sset = serialSet(?, str);
