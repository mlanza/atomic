import {overload} from '../../core';
import {days} from '../duration/construct';
import {midnight} from '../date/concrete';
import {isDate} from '../date/construct';
import {steps} from '../../protocols/isteppable/concrete';
import {patch} from '../../associatives';
import Symbol from '../symbol/construct';

export function Period(start, end, step, direction){
  this.start = start;
  this.end = end;
  this.step = step;
  this.direction = direction;
}

function from({start, end, step, direction}){
  return new Period(start, end, step, direction);
}

export function emptyPeriod(){
  return new Period();
}

function period0(){
  return period1(Infinity);
}

function period1(end){
  return period2(patch(new Date, midnight()), end);
}

function period2(start, end){
  return period3(start, end, days(1));
}

const period3 = steps(Period, isDate);

export const period = overload(period0, period1, period2, period3);

Period.from = from;
Period.create = period;
Period.prototype[Symbol.toStringTag] = "Period";

export default Period;