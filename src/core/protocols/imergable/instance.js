import {overload, identity} from "../../core.js";
import {protocol} from "../../types/protocol.js";
import * as p from "./protocols.js";

function merge(target, source){
  return p.reducekv(p.assoc, target, source);
}

function mergeWith3(xf, init, x){
  return p.reducekv(function(memo, key, value){
    return p.assoc(memo, key, p.contains(memo, key) ? xf(p.get(memo, key), value) : xf(value));
  }, init, x);
}

function mergeWithN(xf, init, ...xs){
  return p.reduce(mergeWith3(xf, ?, ?), init, xs);
}

export const mergeWith = overload(null, null, null, mergeWith3, mergeWithN);

export const IMergable = protocol({
  merge
});
