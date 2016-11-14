import {multimethod} from './core';

function method(defaultFn){
  var map = new Map(),
      set = map.set.bind(map);
  function dispatch(self){
    if (self == null) {
      f = map.get(null);
    } else {
      var pointer = self,
          f = map.get(pointer.constructor);
      while (!f && pointer) {
        pointer = pointer.__proto__;
        if (pointer)
          f = map.get(pointer.constructor);
      }
    }
    return f || defaultFn;
  }
  return Object.assign(multimethod(dispatch), {set: set, dispatch: dispatch});
}

export function Protocol(template){
  for(var key in template){
    this[key] = method(template[key]);
  }
}

export function protocol(template){
  return new Protocol(template);
}

export function satisfies(self, keys, value){
  var ks = keys || self;
  for(var key in ks) {
    if (!self[key].dispatch(value)) return false;
  }
  return true;
}

export function extend(self, template, constructor){
  for(var key in self){
    template[key] && self[key].set(constructor, template[key]);
  }
  return self;
}

export default Protocol;