import {multimethod, curry} from './core';
import Reified from './types/reified';

let _template = Symbol('template'),
    _map      = Symbol('map');

export default function Protocol(template){
  this[_map] = new Map();
  extendProtocol(this, template);
}

export function extendProtocol(self, template){
  self[_template] = Object.assign(self[_template] || {}, template);
  for(var key in template){
    if (!self.hasOwnProperty(key))
      self[key] = method(self, key);
  }
}

export function protocol(template){
  return new Protocol(template);
}

export function satisfies(self, value){
  return value instanceof Reified ? value.map.get(self) : self[_map].get(value == null ? null : value.constructor);
}

function method(protocol, key){
  function dispatch(value){
    var f = (satisfies(protocol, value) || {})[key];
    return f ? f : value != null && value.__proto__.constructor !== Object ? dispatch(value.__proto__) : protocol[_template][key];
  }
  return multimethod(dispatch);
}

export function extend(self, protocol, template){
  var tail = Array.prototype.slice.call(arguments, 3);
  if (self instanceof Reified) {
    var curr = self.map.get(protocol);
    if (!curr){
      curr = {};
      self.map.set(protocol, curr);
    }
  } else {
    var curr = protocol[_map].get(self || null);
    if (!curr){
      curr = {};
      protocol[_map].set(self, curr);
    }
  }
  Object.assign(curr, template);
  return tail.length ? extend.apply(this, [self].concat(tail)) : self;
}