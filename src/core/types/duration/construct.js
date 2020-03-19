import {overload} from "../../core";
import {ICoerceable, IAssociative, ILookup, IDeref, IMap} from "../../protocols";
import {Symbol} from '../symbol/construct';
import {isNumber, inc} from "../number/concrete";

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

//TODO make duration normalize units (e.g. so that when you request `hours` you get the max. value).
function unit(key){

  function f1(self){
    return isNumber(self) ? duration(IAssociative.assoc({}, key, self)) : ILookup.lookup(self, key);
  }

  function f2(self, n){
    return IAssociative.assoc(self, key, n);
  }

  return overload(null, f1, f2);
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