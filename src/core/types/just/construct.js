import {overload, partial} from '../../core';
import {thrush, pipeline} from '../../protocols/ifunctor/concrete';

export function Just(value){
  this.value = value;
}

function just1(value){
  return new Just(value);
}

export const just = overload(null, just1, partial(thrush, just1));

export function isJust(self){
  return self instanceof Just;
}