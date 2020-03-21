import {does, identity} from '../../core';
import {implement} from '../protocol';
import {IBounds, IAddable, IInverse, IComparable, IMultipliable} from '../../protocols';

function compare(self, other){
  return self === other ? 0 : self - other;
}

function add(self, other){
  return self + other;
}

function inverse(self){
  return self * -1;
}

function mult(self, n){
  return self * n;
}

const start = identity,
      end   = identity;

export const behaveAsNumber = does(
  implement(IMultipliable, {mult}),
  implement(IBounds, {start, end}),
  implement(IComparable, {compare}),
  implement(IInverse, {inverse}),
  implement(IAddable, {add}));