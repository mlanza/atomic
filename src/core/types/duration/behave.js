import {implement} from '../protocol';
import {does, identity} from '../../core';
import {ISteppable, ICoerceable, IMultipliable, IMap, IAssociative, ILookup, IInclusive} from '../../protocols';
import {reducekv} from '../../protocols/ikvreduce/concrete';
import {add} from '../../protocols/isteppable/concrete';
import {dadd, isDate} from "../../types/date/concrete";
import {duration} from '../duration/construct';
import {mergeWith} from '../../associatives';

const units = ["year", "month", "day", "hours", "minutes", "seconds", "milliseconds"];

function mult(self, n){
  return new self.constructor(reducekv(function(memo, key, value){
    return IAssociative.assoc(memo, key, value * n);
  }, {}, self.units));
}

function step(self, dt){
  return dt == null ? null : isDate(dt) ? reducekv(function(memo, key, value){
    return dadd(memo, value, key);
  }, dt, self.units) : duration(mergeWith(add, dt.units, self.units));
}

const toDuration = identity;

function keys(self){
  return IMap.keys(self.units);
}

function lookup(self, key){
  if (!IInclusive.includes(units, key)){
    throw new Error("Invalid duration unit.");
  }
  return ILookup.lookup(self.units, key);
}

function assoc(self, key, value){
  if (!IInclusive.includes(units, key)){
    throw new Error("Invalid duration unit.");
  }
  return duration(IAssociative.assoc(self.units, key, value));
}

export const behaveAsDuration = does(
  implement(IAssociative, {assoc}),
  implement(ILookup, {lookup}),
  implement(IMap, {keys}),
  implement(IMultipliable, {mult}),
  implement(ICoerceable, {toDuration}),
  implement(ISteppable, {step}));