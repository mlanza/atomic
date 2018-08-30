import {constantly, does, overload, identity} from '../../core';
import {implement, specify} from '../protocol';
import {IBounds, IEncode, IDecode, ISteppable, IInverse, IComparable, ICheckable} from '../../protocols';
import {isNumber} from "./concrete";

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

function check(self, value){
  return isNumber(value);
}

function complaint(self){
  return "not a number";
}

export default does(
  specify(ICheckable, {check, complaint, terminal: constantly(true)}),
  implement(IBounds, {start: identity, end: identity}),
  implement(IDecode, {decode: identity}),
  implement(IEncode, {encode: identity}),
  implement(IComparable, {compare}),
  implement(IInverse, {inverse}),
  implement(ISteppable, {step}));