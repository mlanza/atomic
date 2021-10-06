import * as _ from "atomic/core";
import Symbol from "symbol";

export function Characters(start, end, f){
  this.start = start;
  this.end = end;
  this.f = f;
}

function chars2(start, end){
  return new Characters(start, end, _.count);
}

function chars1(end){
  return chars2(null, end);
}

export const chars = _.overload(null, chars1, chars2);

Characters.prototype[Symbol.toStringTag] = "Characters";
