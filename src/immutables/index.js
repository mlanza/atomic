import {doto, implement, toArray, GUID, IEquiv, ICounted, IMap} from "atomic/core";
import {IPersistent, TransientSet} from "atomic/transients";
import {set} from "./types/set/construct";
import {IHash} from "./protocols/ihash/instance";
export * from "./types";
export * from "./protocols";

export function hashified(Type){
  if (Type.prototype.hashCode) {
    throw new Error("Cannot override `hashCode`.");
  }
  Type.prototype.hashCode = function(){
    return IHash.hash(this);
  }
  if (Type.prototype.equals) {
    throw new Error("Cannot override `equals`.");
  }
  Type.prototype.equals = function(other){
    return IEquiv.equiv(this, other);
  }
}

(function(){

  function persistent(self){
    return set(toArray(self));
  }

  doto(TransientSet,
    implement(IPersistent, {persistent}));

})();

(function(){

  function hash(self){
    return ICounted.count(self); //TODO implement
  }

  doto(Array,
    hashified,
    implement(IHash, {hash}));

})();

(function(){

  function hash(self){
    return ICounted.count(IMap.keys(self)); //TODO implement
  }

  doto(Object,
    hashified,
    implement(IHash, {hash}));

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