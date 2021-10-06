import * as _ from "atomic/core";
import Symbol from "symbol";

export function Routed(requests){
  this.requests = requests;
}

Routed.prototype[Symbol.toStringTag] = "Routed";

export const routed = _.constructs(Routed);
