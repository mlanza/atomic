import {map, sort} from "../../types/lazy-seq/concrete.js";
import {keys} from "../../protocols/imap/concrete.js";
import {get} from "../../protocols/ilookup/concrete.js";
import {reduce} from "../ireducible.js";
import {hash} from "./concrete.js";

export function hashSeq(hs){
  return reduce(function(h1, h2){
    return 3 * h1 + h2;
  }, 0, map(hash, hs));
}

export function hashKeyed(self){
  return reduce(function(memo, key){
    return hashSeq([memo, key, get(self, key)]);
  }, 0, sort(keys(self)));
}
