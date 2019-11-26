import {doto, implement, toArray, reduce, reducekv, str, map, each, get, keys, sort, IEquiv, ICounted, IMap} from "atomic/core";
import {GUID, AssociativeSubset, Concatenated, EmptyList, Indexed, IndexedSeq} from "atomic/core";
import {IPersistent, TransientSet} from "atomic/transients";
import {set} from "./types/set/construct";
import {IHash} from "./protocols/ihash/instance";
import {_ as v} from "param.macro";

export * from "./types";
export * from "./protocols";

export function hashified(Type){
  if (!Type.prototype.hashCode) {
    Type.prototype.hashCode = function(){
      return IHash.hash(this);
    }
  }
  if (!Type.prototype.equals) {
    Type.prototype.equals = function(other){
      return IEquiv.equiv(this, other);
    }
  }
}

(function(){

  function persistent(self){
    return set(toArray(self));
  }

  doto(TransientSet,
    implement(IPersistent, {persistent}));

})();

function combine(h1, h2){
  return 3 * h1 + h2;
}

(function(){

  function hash(self){
    return reduce(combine, 0, map(IHash.hash, self));
  }

  each(
    doto(v,
      hashified,
      implement(IHash, {hash})),
    [Array, Concatenated, EmptyList]);

})();

(function(){

  function hash(self){
    return self === true ? 1 : 0;
  }

  doto(Boolean,
    hashified,
    implement(IHash, {hash}));

})();

(function(){

  function hash(self){
    return IHash.hash(str(self));
  }

  doto(Number,
    hashified,
    implement(IHash, {hash}));

})();

(function(){

  function hash(self){
    return reduce(function(memo, key){
      return combine(memo, combine(IHash.hash(key), IHash.hash(get(self, key))));
    }, 0, sort(keys(self)));
  }

  each(
    doto(v,
      hashified,
      implement(IHash, {hash})),
    [Object, AssociativeSubset, Indexed, IndexedSeq]);

})();

(function(){

  function hash(self){
    let hash = 0;
    for (let i = 0; i < self.length; i++) {
      hash += Math.pow(self.charCodeAt(i) * 31, self.length - i);
      hash = hash & hash;
    }
    return hash;
  }

  doto(String,
    implement(IHash, {hash}));

})();

(function(){

  function hash(self){
    return IHash.hash(self.id);
  }

  doto(GUID,
    hashified,
    implement(IHash, {hash}));

})();