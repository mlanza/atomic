import {overload, obj, constantly} from '../../core';
import {protocolLookupError} from '../protocollookuperror/construct';
import Nil from '../nil/construct';
import {lazySeq} from '../lazyseq/construct';

export const REGISTRY  = window.Symbol ? Symbol("Registry")  : "__registry";
export const TEMPLATE  = window.Symbol ? Symbol("Template")  : "__template";
export const SPECIFIED = window.Symbol ? Symbol("Specified") : "__specified";

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

function specified(self){
  return self == null || self[SPECIFIED];
}

function inheritance(self, protocol, specific){
  if (self == null) {
    return lazySeq(Nil, constantly(lazySeq(null)));
  } else if (!specific) {
    const specified = self[SPECIFIED];
    if (specified) {
      return lazySeq(specified, function(){
        return inheritance(self, protocol, true);
      });
    } else {
      return inheritance(self, protocol, true);
    }
  } else {
    return lazySeq(self.constructor, function(){
      const proto = Object.getPrototypeOf(self);
      return proto && proto.constructor === Object ? lazySeq(null) : inheritance(proto, protocol, true);
    });
  }
}

export function reifiable(properties){
  function Reifiable(properties){
    Object.assign(this, properties);
  }
  return new Reifiable(properties || {});
}

export function specify(self){
  return self[SPECIFIED] || (self[SPECIFIED] = reifiable());
}

function satisfies1(protocol){
  return function(...args){
    return satisfies(protocol, ...args);
  }
}

function satisfies2(protocol, obj){
  const registry = protocol[REGISTRY];
  let result = inheritance(obj, protocol);
  while(result.head){
    const found = registry.get(result.head);
    if (found) {
      return found;
    }
    result = result.tail();
  }
  return null;
}

function satisfies3(protocol, method, obj){
  const registry = protocol[REGISTRY];
  let result = inheritance(obj, protocol);
  while(result.head){
    const found = (registry.get(result.head) || {})[method];
    if (found) {
      return found;
    }
    result = result.tail();
  }
  return (protocol[TEMPLATE] || {})[method];
}

export const satisfies = overload(null, satisfies1, satisfies2, satisfies3);