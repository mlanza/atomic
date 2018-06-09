import {overload} from '../../core';
import {IComparable, ISteppable} from '../../protocols';

export function Range(start, end, step, direction){
  this.start = start;
  this.end = end;
  this.step = step;
  this.direction = direction;
}

Range.EMPTY = new Range();
Range.prototype[Symbol.toStringTag] = "Range";

function range0(){
  return range1(Number.POSITIVE_INFINITY);
}

function range1(end){
  return range3(0, end, 1);
}

function range2(start, end){
  return range3(start, end, 1);
}

function range3(start, end, step){
  const stepped = ISteppable.step(step, start),
        direction = IComparable.compare(stepped, start);;
  if (direction === 0){
    throw Error("Range has no direction.");
  }
  return IComparable.compare(start, end) * direction < 0 ? new Range(start, end, step, direction) : Range.EMPTY;
}

export const range = overload(range0, range1, range2, range3);

export default Range;