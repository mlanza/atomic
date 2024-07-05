import {persistentMap} from "../persistent-map/construct.js";
import * as p from "./protocols.js";

export function PersistentSet(coll){
  this.coll = coll;
}

export function persistentSet(xs = [], equals = p.equiv){
  const ys = Array.from(xs);
  const set = new PersistentSet(persistentMap([], equals));
  return ys.length ? p.conj(set, ...ys) : set;
}

export const set = persistentSet;
