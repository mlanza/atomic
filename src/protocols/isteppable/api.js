import {overload, identity} from "../../core";
import * as p from "../../protocols";

export function proceed1(self){
  return p.step(p.unit(self), self);
}

export function proceed2(self, amount){
  return p.step(p.unit(self, amount), self);
}

export const proceed = overload(null, proceed1, proceed2);

export function recede1(self){
  return p.step(p.converse(p.unit(self)), self);
}

export function recede2(self, amount){
  return p.step(p.converse(p.unit(self, amount)), self);
}

export const recede = overload(null, recede1, recede2);