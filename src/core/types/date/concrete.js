import {ISeq, INext, IKVReduce, IAssociative} from '../../protocols';
import {intercept} from '../../core';
import {comp} from '../../types/function/concrete';
import {selectKeys} from '../../types/object/concrete';
import {isNumber} from '../../types/number/concrete';
import {into} from '../../types/lazy-seq/concrete';

function trim(obj){ //TODO protocol, compact on sequence, trim on string?
  return IKVReduce.reduce(obj, function(memo, key, value){
    return value == null ? memo : IAssociative.assoc(memo, key, value);
  }, {});
}

export function when(year, month, day, hour, minute, second, millisecond){
  return trim({year, month, day, hour, minute, second, millisecond});
}

export function at(date, keys){
  return selectKeys(_.into({}, date), keys);
}

export function time(hour, minute, second, millisecond){
  return {hour: hour || 0, minute: minute || 0, second: second || 0, millisecond: millisecond || 0};
}

export function sod(){
  return time(0, 0, 0, 0);
}

export function eod(){
  return time(11, 59, 59, 999);
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
    month: function(n){
      return n + 1;
    }
  }
}

export function soy(){
  return {month: 1, day: 1};
}

export function eoy(){
  return {month: 12, day: 31};
}

export function year(n){
  return {year: n};
}

export function month(n){
  return {month: n};
}

export function day(n){
  return {day: n};
}

export function hour(n){
  return {hour: n};
}

export function minute(n){
  return {minute: n};
}

function second1(n){
  return {second: n};
}

export const second = intercept(comp(ISeq.first, INext.next), isNumber, second1);

export function millisecond(n){
  return {millisecond: n};
}