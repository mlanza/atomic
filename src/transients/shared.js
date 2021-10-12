import * as _ from "atomic/core";
import {ITransient} from "./protocols/itransient/instance.js";
import {persistent} from "./protocols/ipersistent/concrete.js";

export function transition(construct){
  function mutate(self, f){
    return persistent(f(transient(self)));
  }

  function transient(self){
    return construct(_.clone(self));
  }

  return _.does(_.implement(ITransient, {transient}));
}
