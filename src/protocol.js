import {multimethod, curry} from './core';

let TEMPLATE = Symbol('template'),
    MAP = Symbol('map');

export function Protocol(template){
  this[TEMPLATE] = template;
  this[MAP] = new Map();
  for(var key in template){
    this[key] = method(this, key);
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

export function extend(self, constructor, template){
  var curr = self[MAP].get(constructor) || {};
  self[MAP].set(constructor, Object.assign(curr, template));
  return self;
}

export default Protocol;