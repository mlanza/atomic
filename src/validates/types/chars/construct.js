import {identity, overload, count} from "atomic/core";

export function Characters(start, end, f){
  this.start = start;
  this.end = end;
  this.f = f;
}

function chars2(start, end){
  return new Characters(start, end, count);
}

function chars1(end){
  return chars2(null, end);
}

export const chars = overload(null, chars1, chars2);