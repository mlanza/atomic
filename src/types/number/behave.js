import {constantly, effect, overload} from '../../core';
import {implement} from '../protocol';
import {IUnit, ISteppable, IComparable, IShow} from '../../protocols';

function compare(self, other){
  return self === other ? 0 : self - other;
}

function step(amount, target){
  return target + amount;
}

function converse(amount){
  return amount * -1;
}

function show(n){
  return n.toString();
}

function unit2(self, amount){
  return amount;
}

const unit = overload(null, constantly(1), unit2);

export default effect(
  implement(IComparable, {compare}),
  implement(ISteppable, {step, converse}),
  implement(IUnit, {unit}),
  implement(IShow, {show}));