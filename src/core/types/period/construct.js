import {overload} from '../../core';
import {days} from '../duration/construct';
import {midnight} from '../date/concrete';
import IAssociative from '../../protocols/iassociative/instance';
import IComparable from '../../protocols/icomparable/instance';
import {ISteppable} from '../../protocols/isteppable';
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

Period.from = from;
Period.prototype[Symbol.toStringTag] = "Period";

function period0(){
  return period1(Infinity);
}

function period1(end){
  return period2(patch(new Date, midnight()), end);
}

function period2(start, end){
  return period3(start, end, days(1));
}

function period3(start, end, step){
  const stepped = ISteppable.step(step, start),
        direction = IComparable.compare(stepped, start);;
  if (direction === 0){
    throw Error("Period has no direction.");
  }
  return new Period(start, end, step, direction);
}

export const period = overload(period0, period1, period2, period3);

export default Period;