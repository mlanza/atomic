import {overload} from "../../core";
import {ICoerceable, IAssociative, ILookup, IDeref, IMap} from "../../protocols";
import {Symbol} from '../symbol/construct';
import {isNumber, inc} from "../number/concrete";
import {prop} from "../../associatives";
import {branch} from "../../core";
import {_ as v} from "param.macro";

export function Duration(units){
  this.units = units;
}

function from(obj){
  return duration(Object.assign({}, obj));
}

export function duration(units){
  return new Duration(isNumber(units) ? {milliseconds: units} : units);
}

Duration.prototype[Symbol.toStringTag] = "Duration";
Duration.create = duration;
Duration.from = from;

function kind(self, key){
  return duration(IAssociative.assoc({}, key, self));
}

//TODO make duration normalize units (e.g. so that when you request `hours` you get the max. value).
function unit(key){
  return branch(isNumber, kind(v, key), overload(null, ILookup.lookup(v, key), IAssociative.assoc(v, key, v)));
}

export const years = unit("year");
export const months = unit("month");
export const days = unit("day");
export const hours = unit("hours");
export const minutes = unit("minutes");
export const seconds = unit("seconds");
export const milliseconds = unit("milliseconds");

export function weeks(n){
  return days(n * 7); //TODO apply against duration/date
}

export function ddiv(a, b){
  return IDeref.deref(ICoerceable.toDuration(a)) / IDeref.deref(ICoerceable.toDuration(b));
}