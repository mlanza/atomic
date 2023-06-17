import {ICompactible} from "./instance.js";
import {filter} from "../../types/lazy-seq/concrete.js";
import {identity, unspread, overload} from "../../core.js";
import {satisfies} from "../../types/protocol/concrete.js";

function compact0(){ //transducer
  return filter(identity);
}

function compact1(self){
  return satisfies(ICompactible, self) ? ICompactible.compact(self) : filter(identity, self);
}

export const compact = overload(compact0, compact1);
export const only = unspread(compact);
