import {overload, obj} from '../../core';
import {protocolLookupError} from '../protocollookuperror/construct';

export const REGISTRY = window.Symbol ? Symbol("Registry") : "__registry";
export const TEMPLATE = window.Symbol ? Symbol("Template") : "__template";

export default function Protocol(template){
  this[REGISTRY] = new WeakMap();
  this[TEMPLATE] = template;
  extend(this, template);
}

export function protocol(template){
  return new Protocol(template);
}

function dispatcher(protocol){
  return function(method){
    return function(self){
      const f = satisfies3(protocol, method, self) || function(){
        throw protocolLookupError(protocol, method, self, arguments);
      }
      return f.apply(this, arguments);
    }
  }
}

export function extend(self, addition){
  const dispatch = dispatcher(self);
  for (var key in addition){
    self[key] = dispatch(key);
  }
}

//Must be shallow to uphold performance.  Obviously, performance degrades on surrogates that appear further down.
export const surrogates = [];

function surrogate(self){
  let construct = null, len = surrogates.length;
  for (let idx = 0; idx < len; idx++){
    if (construct = surrogates[idx](self)) {
      break;
    }
  }
  return construct;
}

function supers(registry, self){
  if (self){
    const proto = Object.getPrototypeOf(self);
    return proto && proto.constructor !== Object ? registry.get(proto.constructor) || supers(registry, proto) : null;
  } else {
    return null;
  }
}

function satisfies1(protocol){
  return function(...args){
    return satisfies(protocol, ...args);
  }
}

function satisfies2(protocol, obj){
  const registry = protocol[REGISTRY];
  return registry.get(obj != null && obj.constructor) || registry.get(surrogate(obj)) || (obj && supers(registry, Object.getPrototypeOf(obj)));
}

function satisfies3(protocol, method, obj){
  return (satisfies2(protocol, obj) || {})[method] || protocol[TEMPLATE][method];
}

export const satisfies = overload(null, satisfies1, satisfies2, satisfies3);