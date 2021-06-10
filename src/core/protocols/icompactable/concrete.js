import {ICompactable} from "./instance.js";
import {filter} from "../../types/lazy-seq/concrete.js";
import {identity, unspread} from "../../core.js";
import {satisfies} from "../../types/protocol/concrete.js";
export function compact(self){
  return satisfies(ICompactable, self) ? ICompactable.compact(self) : filter(identity, self);
}
export const only = unspread(compact);