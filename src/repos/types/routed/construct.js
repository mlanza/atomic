import {constructs} from "atomic/core";

export function Routed(requests){
  this.requests = requests;
}

export const routed = constructs(Routed);