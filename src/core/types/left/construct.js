import {overload, partial} from '../../core';
import {thrush, pipeline} from '../../protocols/ifunctor/concrete';

export function Left(value){
  this.value = value;
}

export function left(value){
  return new Left(value);
}

export function isLeft(self){
  return self instanceof Left;
}