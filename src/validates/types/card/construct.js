import {fnil, pre, constructs, isInteger} from "atomic/core";

export function Cardinality(least, most){
  this.least = least;
  this.most = most;
}

function validCardinality(least, most){
  return isInteger(least) && least >= 0 && most >= 0 && least <= most && (isInteger(most) || most === Infinity);
}

export const card = fnil(pre(constructs(Cardinality), validCardinality), 0, Infinity);
export const opt = card(0, 1);
export const req = card(1, 1);
export const unlimited = card(0, Infinity);