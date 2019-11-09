import {ICompact} from "./instance";
import {filter} from "../../types/lazy-seq/concrete";
import {identity, unspread} from "../../core";
import {satisfies} from "../../types/protocol/concrete";
export function compact(self){
  return satisfies(ICompact, self) ? ICompact.compact(self) : filter(identity, self);
}
export const only = unspread(compact);