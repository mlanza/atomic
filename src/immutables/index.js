import {doto, implement, IPersistent, TransientSet, toArray} from "cloe/core";
import {set} from "./types/set/construct";
export * from "./types";

(function(){

  function persistent(self){
    return set(toArray(self));
  }

  doto(TransientSet,
    implement(IPersistent, {persistent}));

})();