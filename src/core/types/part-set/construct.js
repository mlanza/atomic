import {pipe, constantly} from "../../core.js";
import {set} from "../persistent-set/construct.js";
import {reduce} from "../../protocols/ireducible/concrete.js";
import {assoc} from "../../protocols/iassociative/concrete.js";
import {hash} from "../../protocols/ihashable/concrete.js";
import {conj} from "../../protocols/icollection/concrete.js";
import {str} from "../../types/string/concrete.js";
import {hashClamp} from "../part-map/construct.js";

export function PartSet(partition, store, parts){
  this.partition = partition;
  this.store = store;
  this.parts = parts;
}

export function partSet(items = [], partition, store, parts = {}){
  return reduce(conj, new PartSet(partition, store, parts), items);
}

export const pset = partSet(?,
  pipe(hash, hashClamp(22)),
  constantly(partSet([],
    pipe(str("1", ?), hash, hashClamp(22)),
    constantly(partSet([],
      pipe(str("2", ?), hash, hashClamp(22)),
      constantly(set([])))))));
