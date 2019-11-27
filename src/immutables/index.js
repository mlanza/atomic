import {doto, implement, toArray, constantly, reduce, reducekv, str, map, each, get, keys, sort, IEquiv, ICounted, IMap} from "atomic/core";
import {GUID, AssociativeSubset, Concatenated, EmptyList, List, Indexed, IndexedSeq, Nil} from "atomic/core";
import {IPersistent, TransientSet} from "atomic/transients";
import {set} from "./types/set/construct";
import {IHash} from "./protocols/ihash/instance";
import {_ as v} from "param.macro";
import * as imm from "immutable";

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

  each(implement(IHash, {hash}),
    [Array, Concatenated, List, EmptyList]);

})();

(function(){

  doto(Nil,
    implement(IHash, {hash: constantly(imm.hash(null))}));

})();

(function(){

  function hash(self){
    return reduce(function(memo, key){
      return combine(memo, combine(IHash.hash(key), IHash.hash(get(self, key))));
    }, 0, sort(keys(self)));
  }

  each(implement(IHash, {hash}),
    [Object, AssociativeSubset, Indexed, IndexedSeq]);

})();

(function(){

  each(implement(IHash, {hash: imm.hash}),
    [String, Number, Boolean]);

})();

(function(){

  function hash(self){
    return IHash.hash(self.id);
  }

  doto(GUID,
    implement(IHash, {hash}));

})();