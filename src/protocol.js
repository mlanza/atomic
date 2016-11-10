import {method} from './core.js';

function Protocol(template){
  for(var key in template){
    this[key] = method(template[key]);
  }
}

export function protocol(template){
  return new Protocol(template);
}

export function extend(self, template){
  var kinds = Array.prototype.slice.call(arguments, 2);
  for(var k in kinds){
    var kind = kinds[k];
    for(var key in self){
      template[key] && self[key].map.set(kind, template[key]);
    }
  }
  return self;
}

export default protocol;