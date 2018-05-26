import {overload} from '../../core';
import {REGISTRY, TEMPLATE, constructs} from "./construct";

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

function satisfies1(protocol){
  return function(obj){
    return satisfies2(protocol, obj);
  }
}

function satisfies2(protocol, obj){
  const reg = protocol[REGISTRY];
  return reg.has(obj && obj.constructor) || reg.has(obj) || reg.has(constructs(obj));
}

export const satisfies = overload(null, satisfies1, satisfies2);