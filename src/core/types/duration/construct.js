import {overload} from "../../core";
import {days, weeks} from "../days/construct";
import {months} from "../months/construct";
import {years} from "../years/construct";
import Symbol from '../symbol/construct';

export default function Duration(milliseconds){
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

export const milliseconds = duration1;

export function seconds(n){
  return duration1(n * 1000);
}

export function minutes(n){
  return duration1(n * 1000 * 60);
}

export function hours(n){
  return duration1(n * 1000 * 60 * 60);
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

export function isDuration(self){
  return self instanceof Duration;
}

export {Duration};