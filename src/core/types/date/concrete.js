import {IKVReduce, IAssociative, ILookup, ICloneable, ISeq} from '../../protocols';
import {patch} from '../../associatives';
import {inc} from '../../types/number/concrete';
import {overload} from '../../core';
import {_ as v} from "param.macro";

export function dadd(dt, n, key){
  return IAssociative.assoc(dt, key, ILookup.lookup(dt, key) + n);
}

function dset(dt, n, key){
  return IAssociative.assoc(dt, key, n);
}

function year1(self){
  return self.getFullYear();
}

const year2 = dset(v, v, "year");

export const year = overload(null, year1, year2);

function month1(self){
  return self.getMonth();
}

const month2 = dset(v, v, "month");

export const month = overload(null, month1, month2);

function day1(self){
  return self.getDate();
}

const day2 = dset(v, v, "day");

export const day = overload(null, day1, day2);

export function quarter(self){
  return (month(self) + 1) / 3;
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

function trim(obj){ //TODO protocol, compact on sequence, trim on string?
  return IKVReduce.reducekv(obj, function(memo, key, value){
    return value == null ? memo : IAssociative.assoc(memo, key, value);
  }, {});
}

export function dated(year, month, day, hours, minutes, seconds, milliseconds){
  return trim({year, month, day, hours, minutes, seconds, milliseconds});
}

export function time(hours, minutes, seconds, milliseconds){
  return {
    hours: hours || 0,
    minutes: minutes || 0,
    seconds: seconds || 0,
    milliseconds: milliseconds || 0
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
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  };
}

export const midnight = sod;

export function som(){
  return {
    day: 1,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  };
}

export function eom(){
  return {
    month: inc,
    day: 1,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  };
}

export function bom(){ //bottom of month -- locates last day of month
  return {
    month: inc,
    day: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  };
}

export function soy(){
  return {
    month: 1,
    day: 1,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  };
}

export function eoy(){
  return {
    year: inc,
    month: 1,
    day: 1,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  };
}