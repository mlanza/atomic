import {doto, implement, toArray, constantly, reduce, reducekv, str, map, each, get, keys, sort, IEquiv, ICounted, IMap} from "atomic/core";
import {GUID, AssociativeSubset, Concatenated, EmptyList, Indexed, IndexedSeq, Nil} from "atomic/core";
import {IPersistent, TransientSet} from "atomic/transients";
import {set} from "./types/set/construct";
import {IHash} from "./protocols/ihash/instance";
import {_ as v} from "param.macro";

export * from "./types";
export * from "./protocols";
export * from "./protocols/concrete";

function hashCode(){
  return IHash.hash(this);
}

function equals(other){
  return IEquiv.equiv(this, other);
}

Object.prototype.hashCode = hashCode;
Object.prototype.equals = equals;

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
      implement(IHash, {hash})),
    [Array, Concatenated, EmptyList]);

})();

(function(){

  doto(Nil,
    implement(IHash, {hash: constantly(0)}));

})();

(function(){

  function hash(self){
    return self === true ? 1 : 0;
  }

  doto(Boolean,
    implement(IHash, {hash}));

})();

(function(){

  function hash(self){
    return IHash.hash(str(self));
  }

  doto(Number,
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
    implement(IHash, {hash}));

})();