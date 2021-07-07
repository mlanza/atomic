import * as _ from "atomic/core";
import * as p from "./protocols/concrete.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export * from "./types.js";

import {ITransient} from "./protocols.js";
import {transientObject, transientArray, transientSet} from "./types.js";
import Set from "set";

function toTransient(Type, construct){

  function transient(self){
    return construct(_.clone(self));
  }

  _.doto(Type,
    _.implement(ITransient, {transient}))

}

toTransient(Object, transientObject);
toTransient(Array, transientArray);
toTransient(Set, transientSet);

export function withMutations(self, f){
  return p.persistent(f(p.transient(self)));
}
