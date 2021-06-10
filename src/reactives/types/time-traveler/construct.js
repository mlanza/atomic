import {overload, deref} from "atomic/core";

export function TimeTraveler(pos, max, history, cell){
  this.pos = pos;
  this.max = max;
  this.history = history;
  this.cell = cell;
}

function timeTraveler2(max, cell){
  return new TimeTraveler(0, max, [deref(cell)], cell);
}

function timeTraveler1(cell){
  return timeTraveler2(Infinity, cell);
}

export const timeTraveler = overload(null, timeTraveler1, timeTraveler2);