import {overload} from '../../core';
import {days} from '../days/construct';
import {sod, eod, isDate} from '../date/concrete';
import {steps, add} from '../../protocols/isteppable/concrete';
import {mult} from '../../protocols/imultipliable/concrete';
import {first, rest} from '../../protocols/iseq/concrete';
import {compare} from '../../protocols/icomparable/concrete';
import {patch} from '../../associatives';
import {Symbol} from '../symbol/construct';
import {_ as v} from "param.macro";

export function Recurrence(start, end, step, direction){
  this.start = start;
  this.end = end;
  this.step = step;
  this.direction = direction;
}

function from({start, end, step, direction}){
  return new Recurrence(start, end, step, direction);
}

export function emptyRecurrence(){
  return new Recurrence();
}

export function recurrence1(obj){
  return recurrence2(patch(obj, sod()), patch(obj, eod()));
}

function recurrence2(start, end){
  return recurrence3(start, end, days(end == null || start <= end ? 1 : -1));
}

const recurrence3a = steps(Recurrence, isDate);

function recurrence3(start, end, step){
  const normalize = add(v, mult(step, 0)),
        s  = normalize(start),
        e  = end == null ? end : normalize(end),
        xs = recurrence3a(s, null, step);
  return recurrence3a(compare(start, first(xs)) <= 0 ? s : first(rest(xs)), e, step);
}

export const recurrence = overload(emptyRecurrence, recurrence1, recurrence2, recurrence3);

Recurrence.from = from;
Recurrence.create = recurrence;
Recurrence.prototype[Symbol.toStringTag] = "Recurrence";