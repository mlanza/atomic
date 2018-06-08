import {constantly, effect, overload, identity} from '../../core';
import {implement} from '../protocol';
import {IBounds, IUnit, ISteppable, IConverse, IComparable, IShow} from '../../protocols';

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
  implement(IBounds, {start: identity, end: identity}),
  implement(IComparable, {compare}),
  implement(IConverse, {converse}),
  implement(ISteppable, {step}),
  implement(IUnit, {unit}),
  implement(IShow, {show}));