import {overload, partial} from '../../core';
import {REGISTRY} from "./construct";

export function mark(protocol){
  return implement2(protocol, {}); //marker interface
}

function implement2(protocol, behavior){
  return partial(implement3, protocol, behavior);
}

function implement3(protocol, behavior, type){
  protocol[REGISTRY].set(type, behavior);
}

export function cease(protocol, type){
  protocol[REGISTRY].delete(type);
}

export const implement = overload(null, mark, implement2, implement3);