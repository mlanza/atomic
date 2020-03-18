import {overload} from '../../core';
import {sod, eod} from '../date/concrete';
import {patch} from '../../associatives';
import {Symbol} from '../symbol/construct';
import {_ as v} from "param.macro";

export function Period(start, end){
  this.start = start;
  this.end = end;
}

function from({start, end}){
  return new Period(start, end);
}

export function emptyPeriod(){
  return new Period();
}

export function period1(obj){
  return period2(patch(obj, sod()), patch(obj, eod()));
}

function period2(start, end){
  return new Period(start, end);
}

export const period = overload(emptyPeriod, period1, period2);

Period.from = from;
Period.create = period;
Period.prototype[Symbol.toStringTag] = "Period";