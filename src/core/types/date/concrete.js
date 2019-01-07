import {ISeq, INext, IKVReduce, IAssociative} from '../../protocols';
import {branch} from '../../core';
import {comp} from '../../types/function/concrete';
import {selectKeys} from '../../types/object/concrete';
import {isNumber} from '../../types/number/concrete';
import {into} from '../../types/lazy-seq/concrete';
import Date from './construct';
import {_ as v} from "param.macro";

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

export function at(date, keys){
  return selectKeys(into({}, date), keys);
}

export function time(hours, minutes, seconds, milliseconds){
  return {hours: hours || 0, minutes: minutes || 0, seconds: seconds || 0, milliseconds: milliseconds || 0};
}

export function sod(){
  return time(0, 0, 0, 0);
}

export function eod(){
  return time(23, 59, 59, 999);
}

export function noon(){
  return time(12, 0, 0, 0);
}

export const midnight = sod;

export function som(){
  return {day: 1};
}

export function eom(){
  return {
    day: 1,
    month: function(n){
      return n + 1;
    },
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: -1
  }
}

export function soy(){
  return {month: 1, day: 1};
}

export function eoy(){
  return {month: 12, day: 31};
}