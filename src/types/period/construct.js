import {overload} from '../../core';
import {days} from '../duration/construct';
import {midnight} from '../when/construct';
import {IComparable} from '../../protocols';
import {inject} from '../../multimethods';

export function Period(start, end, step){
  this.start = start;
  this.end = end;
  this.step = step;
}

export const EMPTY_PERIOD = new Period(null, null, null);

function period0(){
  return period1(Infinity);
}

function period1(end){
  return period2(inject(new Date, midnight()), end);
}

function period2(start, end){
  return period3(start, end, days(1));
}

function period3(start, end, step){
  return IComparable.compare(start, end) < 0 ? new Period(start, end, step) : EMPTY_PERIOD;
}

export const period = overload(period0, period1, period2, period3);

export default Period;