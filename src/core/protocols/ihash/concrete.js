import {IHash} from "./instance.js";
import {does} from "../../core.js";
import {implement} from "../../types/protocol/concrete.js";
import {map, sort} from "../../types/lazy-seq/concrete.js";
import {keys} from "../../protocols/imap/concrete.js";
import {get} from "../../protocols/ilookup/concrete.js";
import {reduce} from "../ireduce.js";

export const hash = IHash.hash;

export function hashable(){
  function hash(self){
    const content = [self.constructor.name], keys = Object.keys(self);
    for(let key of keys){
      content.push(key, self[key]);
    }
    return hashing(content);
  }
  return implement(IHash, {hash});
}

export function hashed(hs){
  return reduce(function(h1, h2){
    return 3 * h1 + h2;
  }, 0, Array.from(hs));
}

export function hashing(os){
  return hashed(map(hash, os));
}

export function hashKeyed(self){
  return reduce(function(memo, key){
    return hashing([memo, key, get(self, key)]);
  }, 0, sort(keys(self)));
}

export function hashes(hash){
  return does(implement(IHash, {hash}), function(Type){
    Type.prototype.hashCode = function hashCode(o){
      return hash(this)
    }
  });
}
