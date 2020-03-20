import {ICloneable, ICompactable} from '../../protocols';
import {patch} from '../../associatives';
import {inc} from '../../types/number/concrete';
import {prop} from "../../associatives";
import {overload, identity} from '../../core';

export function monthDays(self){
  return patch(self, {
    month: inc,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  }).getDate();
}

export function weekday(self){
  return self ? !weekend(self) : null;
}

export function weekend(self){
  const day = dow1(self);
  return day == null ? null : day == 0 || day == 6;
}

function dow1(self){
  return self ? self.getDay() : null;
}

function dow2(self, n){
  return self ? dow1(self) === n : null;
}

export const dow = overload(null, dow1, dow2);
export const year = prop("year");
export const month = prop("month");
export const day = prop("day");
export const hour = prop("hour");
export const minute = prop("minute");
export const second = prop("second");
export const millisecond = prop("millisecond");

export function quarter(self){
  return Math.ceil((month(self) + 1) / 3);
}

export function clockHours(self){
  const h = self.getHours();
  return (h > 12 ? h - 12 : h) || 12;
}

export function pm(self){
  return self.getHours() >= 12;
}

//dow = 0-6 if day is in first week.  Add 7 for every additional week.
//e.g. Second Saturday is 13 (6 + 7), First Sunday is 0, Second Sunday is 7.
export function rdow(self, n){
  let dt = ICloneable.clone(self);

  while (n < 0) {
    dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - 7, dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
    n += 7;
  }

  if (n > 6) {
    const dys = Math.floor(n / 7) * 7;
    dt.setDate(dt.getDate() + dys);
    n = n % 7;
  }
  const offset = n - dt.getDay();
  dt.setDate(dt.getDate() + offset + (offset < 0 ? 7 : 0));
  return dt;
}

export function mdow(self, n){
  return rdow(patch(self, som()), n);
}

export function isDate(self){
  return self instanceof Date && !isNaN(self);
}

export function time(hour, minute, second, millisecond){
  return {
    hour: hour || 0,
    minute: minute || 0,
    second: second || 0,
    millisecond: millisecond || 0
  };
}

export function sod(){
  return time(0, 0, 0, 0);
}

export function eod(){
  return Object.assign(sod(), {day: inc});
}

export function noon(){
  return time(12, 0, 0, 0);
}

export function annually(month, day){
  return {
    month: month,
    day: day,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
}

export const midnight = sod;

export function som(){
  return {
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
}

export function eom(){
  return {
    month: inc,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
}

export function bom(){ //bottom of month -- locates last day of month
  return {
    month: inc,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
}

export function soy(){
  return {
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
}

export function eoy(){
  return {
    year: inc,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
}