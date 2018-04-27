import Nil from './types/nil/construct';
import {overload} from './core';

const REGISTRY = window.Symbol ? Symbol("Registry") : "Registry";

export function ProtocolLookupError(registry, subject, named, args) {
  this.registry = registry;
  this.subject = subject;
  this.named = named;
  this.args = args;
}

ProtocolLookupError.prototype = new Error();
ProtocolLookupError.prototype.toString = function(){
  return "Protocol lookup for " + this.named + " failed.";
}

function constructs(self){
  return self == null ? Nil : self.constructor;
}

export default function Protocol(template){
  this[REGISTRY] = new WeakMap();
  extend(this, template);
}

function create(registry, named){
  return function(self) {
    const f = (registry.get(self) || {})[named] || (registry.get(constructs(self)) || {})[named];
    if (!f) {
      throw new ProtocolLookupError(registry, self, named, arguments);
    }
    return f.apply(this, arguments);
  }
}

export function extend(self, template){
  for (var key in template){
    self[key] = create(self[REGISTRY], key).bind(self);
  }
}

export function mark(protocol){
  return function(type){
    implement3(protocol, type, {}); //marker interface
  }
}

function implement2(protocol, impl){
  return function(type){
    implement3(protocol, type, impl);
  }
}

function implement3(protocol, type, impl){
  protocol[REGISTRY].set(type, impl);
}

export const implement = overload(null, mark, implement2, implement3);

export function protocol(template){
  return new Protocol(template);
}

export function satisfies(protocol, obj){
  const reg = protocol[REGISTRY];
  return reg.has(constructs(obj)) || reg.has(obj);
}