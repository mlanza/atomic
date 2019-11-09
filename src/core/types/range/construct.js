import {overload} from '../../core';
import {steps} from '../../protocols/isteppable/concrete';
import {isNumber} from '../number/concrete';
import {Symbol} from '../symbol/construct';

export function Range(start, end, step, direction){
  this.start = start;
  this.end = end;
  this.step = step;
  this.direction = direction;
}

function from({start, end, step, direction}){
  return new Range(start, end, step, direction);
}

export function emptyRange(){
  return new Range();
}

function range0(){
  return range1(Number.POSITIVE_INFINITY);
}

function range1(end){
  return range3(0, end, 1);
}

function range2(start, end){
  return range3(start, end, 1);
}

const range3 = steps(Range, isNumber);

export const range = overload(range0, range1, range2, range3);

Range.from = from;
Range.create = range;
Range.prototype[Symbol.toStringTag] = "Range";