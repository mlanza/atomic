import {overload, partial} from '../../core';
import {thrush} from '../../protocols/ifunctor/concrete';

export function Fluent(value){
  this.value = value;
}

function fluent1(value){
  return new Fluent(value);
}

export const fluent = overload(null, fluent1, partial(thrush, fluent1));