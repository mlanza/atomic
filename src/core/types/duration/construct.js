import {overload, comp, constructs, branch} from "../../core.js";
import {mult} from "../../protocols/imultipliable/concrete.js";
import {isNumber} from "../number/concrete.js";
import Symbol from "symbol";
import * as p from "./protocols.js";

export const toDuration = p.coerce(?, Duration);

export function Duration(units){
  this.units = units;
}

function valueOf(){
  const units = this.units;
  return (
    ((units.year   || 0) * 1000 * 60 * 60 * 24 * 365.25) +
    ((units.month  || 0) * 1000 * 60 * 60 * 24 * 30.4375) +
    ((units.day    || 0) * 1000 * 60 * 60 * 24) +
    ((units.hour   || 0) * 1000 * 60 * 60) +
    ((units.minute || 0) * 1000 * 60) +
    ((units.second || 0) * 1000) +
     (units.millisecond || 0));
}

function unit(key){
  return function(n){
    return new Duration(p.assoc({}, key, n));
  }
}

export const years = unit("year");
export const months = unit("month");
export const days = unit("day");
export const hours = unit("hour");
export const minutes = unit("minute");
export const seconds = unit("second");
export const milliseconds = unit("millisecond");
export const duration = overload(null, branch(isNumber, milliseconds, constructs(Duration)), function(start, end){
  return milliseconds(end - start);
});

export const weeks = comp(days, mult(?, 7));

Duration.prototype[Symbol.toStringTag] = "Duration";
Duration.prototype.valueOf = valueOf;
Duration.units = ["year", "month", "day", "hour", "minute", "second", "millisecond"];
