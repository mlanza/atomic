import * as _ from "atomic/core";

export function Routed(requests){
  this.requests = requests;
}

Routed.prototype[Symbol.toStringTag] = "Routed";

export const routed = _.constructs(Routed);
