import {overload, deref} from "atomic/core";

export function Journal(pos, max, history, cell){
  this.pos = pos;
  this.max = max;
  this.history = history;
  this.cell = cell;
}

function journal2(max, cell){
  return new Journal(0, max, [deref(cell)], cell);
}

function journal1(cell){
  return journal2(Infinity, cell);
}

export const journal = overload(null, journal1, journal2);