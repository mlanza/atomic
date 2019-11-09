import {overload, partial} from '../../core';
import {thrush, pipeline} from '../../protocols/ifunctor/concrete';

export function Maybe(value){
  this.value = value;
}

function maybe1(x){
  return new Maybe(x);
}

export const maybe = overload(null, maybe1, partial(thrush, maybe1));
export const opt = pipeline(maybe1);

export function isMaybe(self){
  return self instanceof Maybe;
}