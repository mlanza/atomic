import {multimethod} from './core';

function method(f){
  var map = new Map(),
      set = map.set.bind(map);
  function dispatch(self){
    return map.get(self == null ? null : self.constructor) || f;
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

export function extend(self, template, ...kinds){
  for(var k in kinds){
    var kind = kinds[k];
    for(var key in self){
      template[key] && self[key].set(kind, template[key]);
    }
  }
  return self;
}

export default Protocol;