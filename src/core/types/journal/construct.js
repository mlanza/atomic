import {overload} from "../../core.js";
import Symbol from "symbol";

export function Journal(pos, max, history, state){
  this.pos = pos;
  this.max = max;
  this.history = history;
  this.state = state;
}

Journal.prototype[Symbol.toStringTag] = "Journal";

function journal2(max, state){
  return new Journal(0, max, [state], state);
}

function journal1(state){
  return journal2(Infinity, state);
}

export const journal = overload(null, journal1, journal2);
