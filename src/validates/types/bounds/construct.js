import {identity, overload} from "atomic/core";
import Symbol from "symbol";

export function Bounds(start, end, f){
  this.start = start;
  this.end = end;
  this.f = f;
}

function bounds3(start, end, f){
  return new Bounds(start, end, f);
}

function bounds2(start, end){
  return bounds3(start, end, identity);
}

function bounds1(end){
  return bounds2(null, end);
}

export const bounds = overload(null, bounds1, bounds2, bounds3);

Bounds.prototype[Symbol.toStringTag] = "Bounds";
