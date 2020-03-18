import {overload} from '../../core';
import {patch} from '../../associatives';
import {isNumber, inc} from '../number';

export function Days(n, options){
  this.n = n;
  this.options = options;
}

export function days(n, options){
  return isNumber(n) ? new Days(n, options || {}) : patch(n, {
    month: inc,
    day: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  }).getDate();
}

export function weeks(n){
  return days(n * 7);
}

export function weekday(dt){
  return dt ? !weekend(dt) : null;
}

export function weekend(dt){
  const day = dow1(dt);
  return day == null ? null : day == 0 || day == 6;
}

function dow1(dt){
  return dt ? dt.getDay() : null;
}

function dow2(dt, n){
  return dt ? dow1(dt) === n : null;
}

export const dow = overload(null, dow1, dow2);

function from({n, options}){
  return days(n, options);
}

Days.from = from;
Days.prototype[Symbol.toStringTag] = "Days";