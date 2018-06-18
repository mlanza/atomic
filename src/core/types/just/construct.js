import {overload} from '../../core';
import {IReduce, IFunctor} from '../../protocols';

export default function Just(value){
  this.value = value;
}

export function just(value){
  return new Just(value);
}

function maybe1(x){
  return x == null ? x : just(x);
}

function maybeN(x, ...fs){
  return IReduce.reduce(fs, IFunctor.fmap, maybe1(x));
}

export const maybe = overload(null, maybe1, maybeN);