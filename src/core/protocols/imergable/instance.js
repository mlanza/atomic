import {overload, identity} from "../../core.js";
import {protocol} from "../../types/protocol.js";
import {assoc, contains} from "../../protocols/iassociative/concrete.js";
import {reduce} from "../../protocols/ireduce/concrete.js";
import {reducekv} from "../../protocols/ikvreduce/concrete.js";
import {get} from "../../protocols/ilookup/concrete.js";

function merge(target, source){
  return reducekv(assoc, target, source);
}

function mergeWith3(xf, init, x){
  return reducekv(function(memo, key, value){
    return assoc(memo, key, contains(memo, key) ? xf(get(memo, key), value) : xf(value));
  }, init, x);
}

function mergeWithN(xf, init, ...xs){
  return reduce(mergeWith3(xf, ?, ?), init, xs);
}

export const mergeWith = overload(null, null, null, mergeWith3, mergeWithN);

export const IMergable = protocol({
  merge
});
