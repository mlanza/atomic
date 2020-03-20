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

export function lcd(self){ //TODO protocol?
  return duration(((self.units.year || 0) * 1000 * 60 * 60 * 24 * 365.25) +
    ((self.units.month || 0) * 1000 * 60 * 60 * 24 * 30.4375) +
    ((self.units.day || 0) * 1000 * 60 * 60 * 24) +
    ((self.units.hour || 0) * 1000 * 60 * 60) +
    ((self.units.minute || 0) * 1000 * 60) +
    ((self.units.second || 0) * 1000) +
    (self.units.millisecond || 0));
}

export function ddiv(a, b){
  return lcd(a).units.millisecond / lcd(b).units.millisecond;
}

Duration.prototype[Symbol.toStringTag] = "Duration";
Duration.create = duration;
Duration.from = from;
Duration.units = ["year", "month", "day", "hour", "minute", "second", "millisecond"];