import {overload, constructs} from "../../core";
import {IAssociative} from "../../protocols";
import {mult} from "../../protocols/imultipliable/concrete";
import {Symbol} from '../symbol/construct';
import {isNumber} from "../number/concrete";
import {branch} from "../../core";
import {comp} from "../function/concrete";
import {_ as v} from "param.macro";

export function Duration(units){
  this.units = units;
}

function from(obj){
  return new Duration(Object.assign({}, obj));
}

function unit(key){
  return function(n){
    return new Duration(IAssociative.assoc({}, key, n));
  }
}

export const years = unit("year");
export const months = unit("month");
export const days = unit("day");
export const hours = unit("hour");
export const minutes = unit("minute");
export const seconds = unit("second");
export const milliseconds = unit("millisecond");
export const duration = branch(isNumber, milliseconds, constructs(Duration));
export const weeks = comp(days, mult(v, 7));

Duration.prototype[Symbol.toStringTag] = "Duration";
Duration.create = duration;
Duration.from = from;
Duration.units = ["year", "month", "day", "hour", "minute", "second", "millisecond"];