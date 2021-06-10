export * from "./protocols.js";
export * from "./protocols/concrete.js";
export * from "./types.js";
import {IPersistent, ITransient} from "./protocols.js";
import {transientObject, transientArray, transientSet} from "./types.js";
import {each, doto, clone, implement} from "atomic/core";
import Set from "set";

function toTransient(Type, construct){

  function transient(self){
    return construct(clone(self));
  }

  doto(Type,
    implement(ITransient, {transient}))

}

toTransient(Object, transientObject);
toTransient(Array, transientArray);
toTransient(Set, transientSet);

export function withMutations(self, f){
  return IPersistent.persistent(f(ITransient.transient(self)));
}