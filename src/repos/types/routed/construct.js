import * as _ from "atomic/core";

export function Routed(requests){
  this.requests = requests;
}

export const routed = _.constructs(Routed);
