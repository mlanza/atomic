import {overload} from '../../core';
import {REGISTRY} from "./construct";

export function mark(protocol){
  return function(type){
    implement3(protocol, type, {}); //marker interface
  }
}

function implement2(protocol, behavior){
  return function(type){
    implement3(protocol, type, behavior);
  }
}

function implement3(protocol, type, behavior){
  protocol[REGISTRY].set(type, behavior);
}

export function cease(protocol, type){
  protocol[REGISTRY].delete(type);
}

export const implement = overload(null, mark, implement2, implement3);