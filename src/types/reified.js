import {slice} from '../core';
import {extend} from '../protocol';

export function reify(protocol, template){
  return extend.apply(this, [new Reified()].concat(slice(arguments)));
}

export function Reified(){
  this.map = new Map();
}

export function reified(){
  return new Reified();
}

export default Reified;