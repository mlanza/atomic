import {overload} from '../../core';
import {days} from '../days/construct';
import {sod, eod, isDate} from '../date/concrete';
import {steps} from '../../protocols/isteppable/concrete';
import {patch} from '../../associatives';
import {Symbol} from '../symbol/construct';

export function Period(start, end, step, direction){
  this.start = start;
  this.end = end;
  this.step = step;
  this.direction = direction;
}

function from({start, end, step, direction}){
  return new Period(start, end, step, direction);
}

export function period1(obj){
  return period2(patch(obj, sod()), patch(obj, eod()));
}

export function emptyPeriod(){
  return new Period();
}

function period0(){
  return period1(null);
}

function period2(start, end){
  return period3(start, end, days(end == null || start <= end ? 1 : -1));
}

const period3 = steps(Period, isDate);

export const period = overload(period0, period1, period2, period3);

Period.from = from;
Period.create = period;
Period.prototype[Symbol.toStringTag] = "Period";