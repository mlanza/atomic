import {overload} from "../../core";
import {ICoerceable, IDeref} from "../../protocols";
import {days, weeks} from "../days/construct";
import {isNumber} from "../number/concrete";
import {months} from "../months/construct";
import {years} from "../years/construct";
import {Symbol} from '../symbol/construct';

export function Duration(milliseconds){
  this.milliseconds = milliseconds;
}

function from({milliseconds}){
  return duration(milliseconds);
}

function duration1(milliseconds){
  return new Duration(milliseconds);
}

function duration2(n, unit, options){
  const f = units[unit];
  if (!f) {
    throw new TypeError("Unknown unit specified.");
  }
  return f(n, options);
}

export const duration = overload(null, duration1, duration2);

Duration.prototype[Symbol.toStringTag] = "Duration";
Duration.create = duration;
Duration.from = from;

export function hours(self){
  return isNumber(self) ? duration1(self * 1000 * 60 * 60) : self.getHours();
}

export function minutes(self){
  return isNumber(self) ? duration1(self * 1000 * 60) : self.getMinutes();
}

export function seconds(self){
  return isNumber(self) ? duration1(self * 1000) : self.getSeconds();
}

export function milliseconds(self){
  return isNumber(self) ? duration1(self) : self.getMilliseconds();
}

const units = {
  milliseconds,
  seconds,
  minutes,
  hours,
  days,
  weeks,
  months,
  years
}

export function ddiv(a, b){
  return IDeref.deref(ICoerceable.toDuration(a)) / IDeref.deref(ICoerceable.toDuration(b));
}