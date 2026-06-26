import {pipe, constantly} from "../../core.js";
import {reduce} from "../../protocols/ireducible/concrete.js";
import {assoc} from "../../protocols/iassociative/concrete.js";
import {hash} from "../../protocols/ihashable/concrete.js";
import {str} from "../../types/string/concrete.js";

export function PartMap(partition, store, parts){
  this.partition = partition;
  this.store = store;
  this.parts = parts;
}

export function partMap(entries = [], partition, store, parts = {}){
  return reduce(function(memo, [key, value]){
    return assoc(memo, key, value);
  }, new PartMap(partition, store, parts), entries);
}

export function hashClamp(n) {
  return function(hash){
    const m = parseInt(hash.toString().replace(".", ""));
    return ((m % n) + n) % n;
  }
}

export const pmap = entries => partMap(entries,
  pipe(hash, hashClamp(11)),
  constantly(partMap([],
    pipe(x => str("a", x), hash, hashClamp(11)),
    constantly(partMap([],
      pipe(x => str("b", x), hash, hashClamp(11)),
      constantly({}))))));
