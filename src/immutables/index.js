import {doto, implement, toArray} from "atomic/core";
import {IPersistent, TransientSet} from "atomic/transients";
import {set} from "./types/set/construct";
export * from "./types";

(function(){

  function persistent(self){
    return set(toArray(self));
  }

  doto(TransientSet,
    implement(IPersistent, {persistent}));

})();