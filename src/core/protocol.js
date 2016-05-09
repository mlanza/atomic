import {method, extend as _extend} from './function.js';

export function def(self, template){
  for(var key in template){
    self[key] = method(template[key])
  }
  return self;
}

export function Protocol(template){
  def(this, template);
}

export function create(template){
  return new Protocol(template);
}

export function extend(self, constructor, template){
  for(var key in self){
    _extend(self[key], constructor, template[key]);
  }
  return self;
}

export function satisfies(self, value){
  for(var key in self) {
    var f = self[key];
    if (!f.dispatch(value)) return false;
  }
  return true;
}

export default create;
