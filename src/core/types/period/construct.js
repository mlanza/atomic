import {overload} from '../../core';
import {patch} from "../../associatives";
import {sod, eod, isDate} from '../date/concrete';
import {add} from '../../protocols/iaddable/concrete';
import {Symbol} from '../symbol/construct';

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

function period2(start, end){ //end could be a duration (e.g. `minutes(30)`).
  const pd = new Period(start, end == null || isDate(end) ? end : add(start, end));
  if (!(pd.start == null || isDate(pd.start))) {
    throw new Error("Invalid start of period.");
  }
  if (!(pd.end == null || isDate(pd.end))) {
    throw new Error("Invalid end of period.");
  }
  if (pd.start != null && pd.end != null && pd.start > pd.end) {
    throw new Error("Period bounds must be chronological.");
  }
  return pd;
}

export const period = overload(emptyPeriod, period1, period2);

Period.from = from;
Period.create = period;
Period.prototype[Symbol.toStringTag] = "Period";