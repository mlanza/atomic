import {overload, partial} from '../../core';
import {thrush, pipeline} from '../../protocols/ifunctor/concrete';

export function Right(value){
  this.value = value;
}

function right1(value){
  return new Right(value);
}

export const right = overload(null, right1, partial(thrush, right1));

export function isRight(self){
  return self instanceof Right;
}

export const just = right;