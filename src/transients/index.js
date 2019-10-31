export * from "./protocols";
export * from "./protocols/concrete";
export * from "./types";
export * from "./multimethods";
import {IPersistent, ITransient} from "./protocols";
import {transientObject, transientArray, transientSet} from "./types";
import {Array, each, doto, clone, implement} from "atomic/core";
import Set from 'set';

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