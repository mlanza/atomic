import * as _ from "atomic/core";
import Symbol from "symbol";

export function Journal(pos, max, history, cell){
  this.pos = pos;
  this.max = max;
  this.history = history;
  this.cell = cell;
}

Journal.prototype[Symbol.toStringTag] = "Journal";

function journal2(max, cell){
  return new Journal(0, max, [_.deref(cell)], cell);
}

function journal1(cell){
  return journal2(Infinity, cell);
}

export const journal = _.called(_.overload(null, journal1, journal2), "`journal` is deprecated — use persistent `journal` from `core` and a `cell`.");
