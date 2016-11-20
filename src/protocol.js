import {multimethod, curry} from './core';

let TEMPLATE = Symbol('template'),
    MAP      = Symbol('map');

export default function Protocol(template){
  this[MAP] = new Map();
  def(this, template);
}

export function def(self, template){
  self[TEMPLATE] = Object.assign(self[TEMPLATE] || {}, template);
  for(var key in template){
    if (!self.hasOwnProperty(key))
      self[key] = method(self, key);
  }
}

export function protocol(template){
  return new Protocol(template);
}

export function satisfies(self, value){
  return self[MAP].get(value == null ? null : value.constructor);
}

function method(protocol, key){
  function dispatch(value){
    var f = (satisfies(protocol, value) || {})[key];
    return f ? f : value != null && value.__proto__.constructor !== Object ? dispatch(value.__proto__) : protocol[TEMPLATE][key];
  }
  return multimethod(dispatch);
}

export function extend(constructor, protocol, template){
  var tail = Array.prototype.slice.call(arguments, 3),
    curr = protocol[MAP].get(constructor) || {};
  protocol[MAP].set(constructor, Object.assign(curr, template));
  return tail.length ? extend.apply(this, [constructor].concat(tail)) : constructor;
}

export function reify(protocol, template){
  function Reified(){
  }
  extend.apply(this, [Reified].concat(slice(arguments)));
  return new Reified();
}