import {overload} from '../../core';
import {IReduce, IFunctor} from '../../protocols';

export default function Just(value){
  this.value = value;
}

export function just(value){
  return new Just(value);
}

export function maybe(x){
  return x == null ? x : just(x);
}

export function isJust(self){
  return self instanceof Just;
}