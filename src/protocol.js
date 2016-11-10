import {method} from './core.js';

export function Protocol(template){
  for(var key in template){
    this[key] = method(template[key]);
  }
}

export function protocol(template){
  return new Protocol(template);
}

export function satisfies(self, value){
  for(var key in self) {
    if (!self[key].dispatch(value)) return false;
  }
  return true;
}

export function extend(self, template){
  var kinds = Array.prototype.slice.call(arguments, 2);
  for(var k in kinds){
    var kind = kinds[k];
    for(var key in self){
      template[key] && self[key].set(kind, template[key]);
    }
  }
  return self;
}

export default Protocol;