import {hashMap} from "../hash-map/construct.js";
import * as p from "./protocols.js";

export function HashSet(coll){
  this.coll = coll;
}

export function hashSet(xs = [], equals = p.equiv){
  const ys = Array.from(xs);
  const set = new HashSet(hashMap([], equals));
  return ys.length ? p.conj(set, ...ys) : set;
}

export const set = hashSet;
