import ISteppable from "./instance";
import {compare} from "../icomparable/concrete";
export const step = ISteppable.step;

export function steps(Type, pred){
  return function(start, end, step){
    if (start != null && !pred(start)) {
      throw Error(Type.name + " passed invalid start value.");
    }
    if (end != null && !pred(end)) {
      throw Error(Type.name + " passed invalid end value.");
    }
    const stepped = ISteppable.step(step, start),
          direction = compare(stepped, start);;
    if (direction === 0){
      throw Error(Type.name + " has no direction.");
    }
    return new Type(start, end, step, direction);
  }
}