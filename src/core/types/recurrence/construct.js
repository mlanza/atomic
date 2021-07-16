import {overload, constantly} from "../../core.js";
import {patch} from "../../protocols/iassociative/concrete.js";
import {days} from "../duration/construct.js";
import {sod, eod, isDate} from "../date/concrete.js";
import {filter} from "../lazy-seq/concrete.js";
import {steps, directed} from "../../protocols/iaddable/concrete.js";
import {compare} from "../../protocols/icomparable/concrete.js";
import Symbol from "symbol";

export function Recurrence(start, end, step, direction){
  this.start = start;
  this.end = end;
  this.step = step;
  this.direction = direction;
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

const recurrence3 = steps(Recurrence, isDate);

function recurrence4(start, end, step, f){
  const pred = end == null ? constantly(true) : directed(start, end) > 0 ? function(dt){
    return compare(start, dt) <= 0;
  } : directed(start, end) < 0 ? function(dt){
    return compare(start, dt) >= 0;
  } : constantly(true);
  return filter(pred, f(recurrence3(start, end, step)));
}

export const recurrence = overload(emptyRecurrence, recurrence1, recurrence2, recurrence3, recurrence4);

Recurrence.prototype[Symbol.toStringTag] = "Recurrence";
