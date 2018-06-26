import {overload, obj, constantly} from '../../core';
import {protocolLookupError} from '../protocol-lookup-error/construct';
import Nil from '../nil/construct';

const BLANK = {};

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
  let memo   = obj,
      result = memo == null ? registry.get(Nil) : registry.get(memo[SPECIFIED]);
  while(!result){
    result = registry.get(memo.constructor);
    memo   = Object.getPrototypeOf(memo);
    if (memo == null || memo.constructor === Object) {
      break;
    }
  }
  return result;
}

function satisfies3(protocol, method, obj){
  const registry = protocol[REGISTRY];
  let memo   = obj,
      result = memo == null ? registry.get(Nil) : registry.get(memo[SPECIFIED]);
  while(!(result || BLANK)[method]){
    result = registry.get(memo.constructor);
    memo   = Object.getPrototypeOf(memo);
    if (memo == null || memo.constructor === Object) {
      break;
    }
  }
  return (result || protocol[TEMPLATE] || BLANK)[method];
}

export const satisfies = overload(null, satisfies1, satisfies2, satisfies3);