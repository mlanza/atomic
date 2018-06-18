import {overload} from '../../core';
import {IReduce, IFunctor} from '../../protocols';
import {isError} from '../error/construct';

export default function Okay(value){
  this.value = value;
}

function okay1(x){
  return isError(x) ? x : new Okay(x);
}

export function isOkay(x){
  return x instanceof Okay;
}

function okayN(x, ...fs){
  return IReduce.reduce(fs, IFunctor.fmap, okay1(x));
}

export const okay = overload(null, okay1, okayN);