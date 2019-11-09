import {constantly, does, overload, identity} from '../../core';
import {implement} from '../protocol';
import {IBounds, IEncode, IDecode, ISteppable, IInverse, IComparable} from '../../protocols';

function compare(self, other){
  return self === other ? 0 : self - other;
}

function step(amount, target){
  return target + amount;
}

function inverse(amount){
  return amount * -1;
}

function unit2(self, amount){
  return amount;
}

const unit = overload(null, constantly(1), unit2);

export const behaveAsNumber = does(
  implement(IBounds, {start: identity, end: identity}),
  implement(IDecode, {decode: identity}),
  implement(IEncode, {encode: identity}),
  implement(IComparable, {compare}),
  implement(IInverse, {inverse}),
  implement(ISteppable, {step}));