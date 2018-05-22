import {overload} from './core';

const REGISTRY = window.Symbol ? Symbol("Registry") : "__registry";
const TEMPLATE = window.Symbol ? Symbol("Template") : "__template";

export function ProtocolLookupError(protocol, named, subject, args) {
  this.protocol = protocol;
  this.named = named;
  this.subject = subject;
  this.args = args;
}

ProtocolLookupError.prototype = new Error();
ProtocolLookupError.prototype.toString = function(){
  return "Protocol lookup for " + this.named + " failed.";
}

//Must be shallow to uphold performance.  Obviously, performance degrades on surrogates that appear further down.
export const surrogates = [];

function constructs(self){
  let construct = null, len = surrogates.length;
  for (let idx = 0; idx < len; idx++){
    if (construct = surrogates[idx](self)) {
      break;
    }
  }
  return construct;
}

export default function Protocol(template){
  this[REGISTRY] = new WeakMap();
  this[TEMPLATE] = template;
  extend(this, template);
}

function dispatcher(protocol){
  const registry = protocol[REGISTRY], template = protocol[TEMPLATE], blank = {};
  return function(named){
    return function(self){
      const f = (registry.get(self) || blank)[named] || (registry.get(self && self.constructor) || blank)[named] || (registry.get(constructs(self)) || blank)[named] || template[named] || function(){
        throw new ProtocolLookupError(protocol, named, self, arguments);
      }
      return f.apply(this, arguments);
    }
  }
}

export function extend(self, addition){
  const dispatch = dispatcher(self);
  for (var key in addition){
    self[key] = dispatch(key).bind(self);
  }
}

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

export function protocol(template){
  return new Protocol(template);
}

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