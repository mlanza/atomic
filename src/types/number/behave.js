import {constantly, effect, overload} from '../../core';
import {implement} from '../../protocol';
import {IUnit, ISteppable, IShow} from '../../protocols';

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

export default effect(
  implement(ISteppable, {step: step, converse: converse}),
  implement(IUnit, {unit: overload(null, constantly(1), unit2)}),
  implement(IShow, {show: show}));