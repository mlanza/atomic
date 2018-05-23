import {protocolLookupError} from '../protocollookuperror/construct';

export const REGISTRY = window.Symbol ? Symbol("Registry") : "__registry";
export const TEMPLATE = window.Symbol ? Symbol("Template") : "__template";

export function protocol(template){
  return new Protocol(template);
}

//Must be shallow to uphold performance.  Obviously, performance degrades on surrogates that appear further down.
export const surrogates = [];

export function constructs(self){
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

function supers(registry, self){
  if (self){
    const proto = Object.getPrototypeOf(self);
    return proto && proto.constructor !== Object ? registry.get(proto.constructor) || supers(registry, proto) : null;
  } else {
    return null;
  }
}

function dispatcher(protocol){
  const registry = protocol[REGISTRY], template = protocol[TEMPLATE], blank = {};
  return function(named){
    return function(self){
      const f = (registry.get(self) || blank)[named] || (registry.get(self && self.constructor) || blank)[named] || (registry.get(constructs(self)) || blank)[named] || (supers(registry, Object.getPrototypeOf(self)) || blank)[named] || template[named] || function(){
        throw protocolLookupError(protocol, named, self, arguments);
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